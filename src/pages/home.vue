<template>
    <div class="layout" style="height:100%">
        <layout :style="{height: '100%',overflow: 'hidden'}">
            <sider hide-trigger>
                <i-menu class="side" theme="dark" :style="{height: '100%', width: '200px',overflow: 'auto'}">
                    <submenu v-if="nowUser.authList" v-for="items in nowUser.authList" :key="items.name" :name="items.name">
                        <template slot="title">
                            <icon :type="items.icon"></icon>
                            {{ items.authName}}
                        </template>
                        <router-link v-for="items2 in items.child" :key="items2.name" :to="items2.url">
                            <menu-item :name="items2.name">{{items2.authName}}</menu-item>
                        </router-link>
                    </submenu>
                </i-menu>
            </sider>
            <layout :style="{height: '100%',overflow: 'hidden'}">
                <i-header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                    <div class="layout-logo"></div>
                    <div style="float:right;padding-top:14px">
                        <!-- 当前登陆的用户 -->
                        <poptip content="content" placement="bottom-end" popper-class="pop">
                            <!-- <i-button>Bottom Right</i-button> -->
                            <img src="../assets/author.png" style="cursor:pointer"/>
                            <div slot="title">
                                <div class="nowUserName">
                                    <img src="../assets/author.png" style="cursor:pointer"/>
                                    <p>{{ nowUser.user.name }}</p>
                                    <span 
                                        style="position:absolute;bottom:8px;right:10px;font-size:16px;cursor:pointer;color:#3090e8;" 
                                        title="修改密码"
                                        @click="modal = true"
                                        v-show="nickPowerControl.pwdChange">
                                        <icon type="ios-lock" />
                                    </span>
                                </div>
                                <modal
                                    v-model="modal"
                                    title="修改密码"
                                    class="modal"
                                    width="320">
                                    <i-form :label-width="80" :rules="rule" :model="modalData" ref="modalData">
                                        <row>
                                            <i-col span="24">
                                                <form-item label="原密码" prop="oldPwd">
                                                    <i-input type="password" v-model="modalData.oldPwd" placeholder="请输入原密码" />
                                                </form-item>
                                            </i-col>
                                        </row>
                                        <row>
                                            <i-col span="24">
                                                <form-item label="新密码" prop="newPwd">
                                                    <i-input type="password" v-model="modalData.newPwd" placeholder="请输入新的密码" />
                                                </form-item>
                                            </i-col>
                                        </row>
                                        <row>
                                            <i-col span="24">
                                                <form-item label="再次密码" prop="newPwd2">
                                                    <i-input type="password" v-model="modalData.newPwd2" placeholder="请再次输入密码" />
                                                </form-item>
                                            </i-col>
                                        </row>
                                    </i-form>
                                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                                        <i-button class="btn" @click="modal = false">取消</i-button>
                                        <i-button class="btn" type="primary" @click="changePwd">修改密码</i-button>
                                    </div>
                                </modal>
                                <div class="nowUserRole">
                                    <p>当前职位：{{nowUser.user.job}}</p>
                                </div>
                            </div>
                            <div slot="content" style="text-align:center">
                                <a @click="modalExit = true">退出登陆</a>
                            </div>
                            <modal
                                v-model="modalExit"
                                title="提示"
                                class="modal">
                                <div style="width:100%;">
                                    <span>确定要退出吗？</span>
                                </div>
                                <div slot="footer" style="width:100%;padding: 12px 18px;">
                                    <i-button class="btn" @click="modalExit = false">取消</i-button>
                                    <i-button class="btn" type="error" @click="exit">退出</i-button>
                                </div>
                            </modal>
                        </poptip>
                    </div>
                </i-header>
                <i-content :style="{padding: '16px',height: '50%'}">
                    <router-view/>
                </i-content>
            </layout>
        </layout>
    </div>
</template>

<script>
import httpConfig from '../http/httpConfig.js'
import common from '../JS/common.js'
export default {
    data(){
        return {
            nowUser: {
                user: {
                    job: 'undefined',
                    name: 'undefined'
                }
            },
            modal: false, //控制修改模态框的显示
            modalData: {
                oldPwd: '',
                newPwd: '',
                newPwd2: ''
            }, //修改模态框需要的数据
            rule: {
                oldPwd: [
                    { required: true, message: '旧密码不能为空', trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                newPwd2: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ]
            },
            modalExit: false, //登出模态框的控制
            nickPowerControl:{
                pwdChange: false,
            }, //小权限按钮的显示与否控制
        }
    },
    methods:{
        exit(){
            var vm = this;
            let arr = {};
            httpConfig.post('/common/exit',arr,function(){
                vm.$router.push('/')
            })
        },
        changePwd(){
            var vm = this;
            if(vm.modalData.newPwd == vm.modalData.newPwd2){
                let arr = {
                    id: common.getSession('userId').id,
                    oldPwd: vm.modalData.oldPwd,
                    newPwd: vm.modalData.newPwd
                }
                httpConfig.post('/user/updatePwd',arr,function(data){
                    if(data.result == 0){
                        vm.$Message.error('旧密码错误!');
                    }else{
                        vm.$Message.success('修改成功!');
                        vm.modal = false;
                    }
                })
            }else{
                vm.$Message.error('两次新密码输入不一致!');
            }
        }
    },
    mounted(){
        var vm = this;
        let arr = {
            id: common.getSession('userId').id
        }
        httpConfig.post('/common/viewAllById',arr,function(data){
            vm.nowUser = data.result;
            var tmp1 = [];
            var tmp2 = [];
            var tmp3 = [];
            vm.nowUser.authList.forEach(element => {
                element.child = [];
                if(element.levalId == 1){
                    tmp1.push(element)
                }else if(element.levalId == 2){
                    tmp2.push(element)
                }else{
                    tmp3.push(element)
                }
            });
            tmp2.forEach(items2 => {
                tmp1.forEach(items1 => {
                    if(items2.superiorAuthId == items1.id){
                        items1.child.push(items2)
                    }
                    return false
                });
            });
            var i = 1;
            tmp1.forEach(items => {
                items.name = i;
                if(items.child != []){
                    var j = 1;
                    items.child.forEach(element => {
                        if(element.url == undefined){
                            element.url = '/home'
                        }
                        element.name = i + '-' + j;
                        j++;
                    });
                }
                i++;
            });
            vm.nowUser.authList = tmp1;
            var nickName = {};
            tmp3.forEach(items => {
                vm.$set(vm.nickPowerControl,items.nickName,true);
            });
            common.setSession('nickName',tmp3);
        })
    }
}
</script>

<style>
    body,html{
        height: 100%
    }
    .ivu-poptip,.ivu-poptip-rel{
        height: 36px;
    }
</style>

<style scoped>
    .layout-con{
        height: 100%;
        width: 100%;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        /* background: #5b6270; */
        background-image: url(../assets/logo2.png);
        background-size: contain;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .nowUserName{
        padding: 10px 0;
        position: relative;
        text-align: center;
        border-bottom:1px solid #f2f2f2;
    }
    .nowUserRole{
        padding:10px 0 2px 0;
    }
    .side::-webkit-scrollbar{
        width:0px
    }
</style>