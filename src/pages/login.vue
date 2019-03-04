<template>
    <div style="height:100vh;width:100%;min-height:100vh;background:linear-gradient(-180deg,#54c6fa,#2a94f3);overflow:hidden;">
        <div class="bg-bottom">
            <div class="header">
                <img src="../assets/logo.png">
                <div>ESLink后台管理</div>
            </div>
            <div class="content">
                <row>
                    <i-col span="12" style="height:344px;">
                        <img src="../assets/login-img.png" style="height:100%;width:auto;">
                    </i-col>
                    <i-col span="12" style="height:344px;">
                        <div class="login">
                            <h3>欢迎使用ESLink后台管理</h3>
                            <div style="padding-top:30px;">
                                <i-input size="large" class="input" v-model="account" placeholder="请输入账号" style="width: 100%;" />
                                <i-input type="password" size="large" class="input" v-model="password" placeholder="请输入密码" style="width: 100%;" />
                            </div>
                            <div v-show="validcode.show">
                                <i-input id="code_input" size="large" class="input" v-model="validcode.value" placeholder="请输入验证码" style="width: 50%;float:left;" />
                                <!-- <img src="" alt="未获得验证码图片" style="width:50%;height:44px;"> -->
                                <div id="v_container" style="width:50%;height:44px;float:right;"></div>
                            </div>
                            <i-button size="large" type="primary" style="width:100%;text-align:center;" @click="login">
                                <span style="letter-spacing: 1px;">登录</span>
                            </i-button>
                        </div>
                    </i-col>
                </row>
            </div>
            <div class="footer">
                关于ESLink 联系我们 易联云计算（杭州）有限责任公司 ©copyright 2015-2018
            </div>
        </div>
    </div>
</template>


<script>
import valid from '../JS/valid.js'
import httpConfig from '../http/httpConfig.js'
import common from '../JS/common.js'
export default {
    data(){
        return{
            account: '',
            password: '',
            validcode: {
                show: false,
                value: '',
                imgSrc: '',
                errTimes: 0,
            },
            valid: {},
        }
    },
    methods:{
        login(){
            var vm = this;
            let arr = {
                empno: vm.account,
                password: vm.password
            }
            if( vm.account == '' || vm.password == ''){
                vm.$Message.error('账号密码不能为空');
            }else if(vm.validcode.errTimes < 3){
                httpConfig.post('/common/login',arr,function(data){
                        common.setSession('errTimes',0);
                        common.setSession('userId',data.result);
                        vm.$router.push('/home')
                },function(data){
                    if(data.responseCode == '99999'){
                        vm.validcode.errTimes += 1;
                        common.setSession('errTimes',vm.validcode.errTimes);
                    }
                    vm.$Message.error(data.message);
                })
            }else{
                var res = vm.valid.validate(vm.validcode.value);
                if(res){
                    httpConfig.post('/common/login',arr,function(data){
                        common.setSession('errTimes',0);
                        common.setSession('userId',data.result);
                        vm.$router.push('/home')
                    })
                }else{
                    vm.$Message.error('验证码错误');
                }
            }
        }
    },
    mounted(){
        var vm = this;
        var verifyCode = new GVerify("v_container");
        vm.valid = verifyCode;
        if(common.getSession('errTimes') == null){
            common.setSession('errTimes',0);
            vm.validcode.errTimes = 0;
        }else{
            vm.validcode.errTimes = common.getSession('errTimes');
        }
    },
    watch: {
        'validcode.errTimes'(){
            var vm = this;
            if (vm.validcode.errTimes >= 3){
                vm.validcode.show = true;
            }
        }
    }
}
</script>

<style>
    .ivu-input-large,.ivu-btn-large{
        height: 44px; 
    }
    #verifyCanvas{
        height: 100%;
        width: 100%;
    }
</style>


<style scoped>
    *{
        font-size: 14px;
        letter-spacing: 1px;
        line-height: 1.8;
    }
    .bg-bottom{
        background: url(../assets/bg-bottom.png) no-repeat 0 100%;
        height:100%;
        background-size: contain;
    }
    .header{
        width: 1024px;
        margin: 0 auto;
        padding: 30px 0;
    }
    .header img{
        height: 45px;
        width: auto;
        margin-right: 10px;
        float: left;
    }
    .header div{
        margin-bottom: 3px;
        color: white;
        font-size: 18px;
        line-height: 70px;
        /* letter-spacing: 1px; */
    }
    .content{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1024px;
        height: 344px;
        margin-left: -512px;
        margin-top: -172px;
    }
    .login{
        background: #fff;
        width: 340px;
        height: 344px;
        margin: 0 auto;
        padding: 30px;
        border-radius: 2px;
    }
    h3{
        font-size: 20px;
        font-weight: 400;
    }
    .input{
        margin-bottom: 16px;
    }
    .footer{
        position: absolute;
        bottom: 59px;
        left: 50%;
        width: 1024px;
        margin-left: -512px;
        color: #fff;
        font-size: 12px;
    }
</style>
