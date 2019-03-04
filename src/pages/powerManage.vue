<template>
    <div style="width:100%;height:100%;overflow:auto">
        <div class="border-box">
            <!-- title -->
            <div class="title-container">
                权限列表
            </div>
            <!-- 按钮以及查询的输入框 -->
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;">
                <i-input v-show="nickPowerControl.authListByAuth" v-model="selectInput" placeholder="请输入权限名称" style="width: 300px" />
                <i-button v-show="nickPowerControl.authListByAuth" class="btn" @click="select">查询</i-button>
                <!-- 以下是新增按钮以及其模态框 -->
                <i-button v-show="nickPowerControl.authAdd" class="btn" type="primary" @click="modalXzClick">新增</i-button>
                <modal
                    v-model="modalXz"
                    title="新增"
                    class="modal"
                    width="800">
                    <i-form :label-width="120" :rules="xzRule" :model="modalXzData" ref="modalXzData">
                        <row>
                            <i-col span="12">
                                <form-item label="权限名称" prop="authName">
                                    <i-input v-model="modalXzData.authName" placeholder="请输入权限名称" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="父级权限" prop="superiorAuthId">
                                    <i-select v-model="modalXzData.superiorAuthId">
                                        <i-option v-for="item in parentPower" :value="item.id" :key="item.id" 
                                            v-html="item.authNameWithSpace"
                                            :label="item.authName">
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="权限路径" prop="authPath">
                                    <i-input v-model="modalXzData.authPath" placeholder="请输入权限路径" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="排序" prop="orders">
                                    <i-input v-model="modalXzData.orders" placeholder="请输入排序" />
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="页面地址" prop="url">
                                    <i-input v-model="modalXzData.url" placeholder="请输入页面地址" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="菜单图标" prop="icon">
                                    <i-select v-model="modalXzData.icon">
                                        <i-option v-for="items in iconList" :value="items" :key="items">
                                            <icon :type="items"></icon>
                                            {{ items }}
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="状态" prop="status">
                                    <radio-group v-model="modalXzData.status">
                                        <radio label="正常"></radio>
                                        <radio label="停用"></radio>
                                    </radio-group>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="权限描述" prop="description">
                                    <i-input v-model="modalXzData.description" placeholder="请输入权限描述" />
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXzCz('modalXzData')">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXzXz('modalXzData')">新增</i-button>
                    </div>
                </modal>
            </div>
            <!-- 表格 -->
            <div style="width:100%;">
                <i-table v-show="nickPowerControl.authPage" border disabled-hover :columns="columns" :data="showLists"></i-table>
                <!-- 修改 -->
                <modal
                    v-model="modalXg"
                    title="修改"
                    class="modal"
                    width="800">
                    <i-form :label-width="120" :rules="xzRule" :model="modalXgData" ref="modalXgData">
                        <row>
                            <i-col span="12">
                                <form-item label="权限名称" prop="authName">
                                    <i-input v-model="modalXgData.authName" placeholder="请输入权限名称" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="权限路径" prop="authPath">
                                    <i-input v-model="modalXgData.authPath" placeholder="请输入权限路径" />
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="排序" prop="orders">
                                    <i-input v-model="modalXgData.orders" placeholder="请输入排序" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="页面地址" prop="url">
                                    <i-input v-model="modalXgData.url" placeholder="请输入页面地址" />
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="菜单图标" prop="icon">
                                    <i-select v-model="modalXgData.icon">
                                        <i-option v-for="item in iconList" :value="item" :key="item">
                                            <icon :type="item"></icon>
                                            {{ item }}
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="状态" prop="status">
                                    <radio-group v-model="modalXgData.status">
                                        <radio label="正常"></radio>
                                        <radio label="停用"></radio>
                                    </radio-group>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="权限描述" prop="description">
                                    <i-input v-model="modalXgData.description" placeholder="请输入权限描述" />
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXgCz('modalXgData')">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXgXg('modalXgData')">修改</i-button>
                    </div>
                </modal>
                <!-- 删除 -->
                <modal
                    v-model="modalDelete"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要删除该权限吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="powerDelete">删除</i-button>
                    </div>
                </modal>
            </div>
            <!-- 下面控制页码 -->
            <div style="width:100%;margin-top:16px;">
                <page :total="dataCount" :page-size="pageSize" 
                @on-change="changePage" 
                style="float:right;" 
                v-show="nickPowerControl.authPage"
                show-total
                :current="nowPage"/>
            </div>
        </div>
    </div>
</template>


<script>
import httpConfig from '../http/httpConfig.js'
import common from '../JS/common.js'
export default {
    data(){
        return{
            columns: [
                { title: '编号',key: 'id' },
                { title: '权限名称',key: 'authName' },
                { title: '权限路径',key: 'authPath' },
                { title: '菜单图标',key: 'icon' },
                { title: '页面地址',key: 'url' },
                { title: '权限描述',key: 'description' },
                { title: '排序',key: 'orders' },
                { title: '状态',key: 'status' },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    display: this.nickPowerControl.authUpdate? 'inline-block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.modify(params.index)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style:{
                                    display: this.nickPowerControl.authDel? 'inline-block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ], //列表的表头
            totalLists: [], //存储所有数据
            showLists: [], //存储当前页的数据
            pageSize: 10, //每页展示数量
            nowPage: 0, //当前页
            selectInput: '', //查询输入框的值
            modalXz: false, //控制新增模态框的显示
            modalXg: false, //控制修改模态框的显示
            modalDelete: false, //控制删除模态框的显示
            modalXzData: {
                authName: '',
                authPath: '',
                superiorAuthId: '',
                url: '',
                description: '',
                orders: '',
                status: '正常',
                icon: '',
            }, //新增模态框需要的数据
            modalXgData: {
            }, //修改模态框需要的数据
            xzRule: {
                authName: [
                    { required: true, message: '权限名称不能为空', trigger: 'blur' }
                ],
            }, //新增模态框规则
            parentPower: [], //父级权限列表
            iconList: [], //图标列表
            nowData: {}, //当前选中用户
            nickPowerControl:{
                authPage: false,
                authListByAuth: false,
                authAdd: false,
                authDel: false,
                authUpdate: false,
            }, //小权限按钮的显示与否控制
        }
    },
    mounted: function(){
        var vm = this;
        var tmp = common.getSession('nickName');
        tmp.forEach(items => {
            vm.$set(vm.nickPowerControl,items.nickName,true);
        });
        vm.getPowerList();
        vm.changePage(1);
    },
    methods:{
        getPowerList(){
            let arr = {};
            var vm = this;
            httpConfig.post('/auth/page',arr,function(data){
                vm.totalLists = data.result;
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else{
                        items.status = "停用";
                    }
                })
            })
        }, //获取权限列表
        changePage(index){
            var start = (index - 1) * this.pageSize;
            var end = index * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
            this.nowPage = index;
        }, //换页
        modalXzClick(){
            var vm = this;
            var arr = {};
            vm.parentPower = [];
            httpConfig.post('/auth/listLeval',arr,function(data){
                data.result.forEach(items => {
                    if(items.levalId == 1 || items.levalId == 2){
                        vm.parentPower.push(items)
                    }
                });
                vm.parentPower.forEach(items => {
                    items.authNameWithSpace = items.authName;
                    if(items.levalId == 2){
                        items.authNameWithSpace = '&nbsp;&nbsp;&nbsp;&nbsp;' + items.authNameWithSpace;
                    }
                });
                httpConfig.post('/auth/listIcon',{},function(data){
                    vm.iconList = data.result;
                    vm.modalXz = true;
                })
            });
        }, //新增按钮单击
        modalXzCz(name){
            this.$refs[name].resetFields();
        }, //新增模态框重置
        modalXzXz(name) {
            var vm = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(vm.modalXzData.status == '正常'){
                        vm.modalXzData.status = 0
                    }else{
                        vm.modalXzData.status = 1
                    }
                    let arr = vm.modalXzData;
                    httpConfig.post('/auth/add',arr,function(data){
                        vm.getPowerList();
                        vm.modalXz = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //新增模态框新增
        select(){
            var vm = this;
            let arr = {authName: vm.selectInput};
            httpConfig.post('/auth/listByName',arr,function(data){
                vm.totalLists = data.result;
                vm.changePage(1);
                vm.totalLists.forEach(items => {
                    if(items.status == 0){
                        items.status = '正常'
                    }else{
                        items.status = '停用'
                    }
                });
            })
        }, //查询
        remove(index){
            var vm = this;
            vm.nowData = {
                id: vm.showLists[index].id,
            }
            vm.modalDelete = true;
        }, //删除按钮单击
        powerDelete(){
            var vm = this;
            let arr = vm.nowData;
            httpConfig.post('/auth/delete',arr,function(){
                if(vm.showLists.length == 1){
                    vm.nowPage -= 1;
                }
                vm.getPowerList();
                vm.modalDelete = false;
                vm.$Message.success('Success!');
            },function(){
                vm.$Message.error('Fail!');
            })
        }, //删除模态框确认删除
        modify(index){
            var vm = this;
            vm.nowData = vm.showLists[index];
            vm.modalXgData = {
                id: vm.nowData.id,
                authName: vm.nowData.authName,
                authPath: vm.nowData.authPath,
                url: vm.nowData.url,
                description: vm.nowData.description,
                orders: vm.nowData.orders,
                status: vm.nowData.status,
                icon: vm.nowData.icon,
            }
            httpConfig.post('/auth/listIcon',{},function(data){
                vm.iconList = data.result;
            })
            vm.modalXg = true;
        }, //修改按钮单击
        modalXgCz(name){
            var vm = this;
            vm.$refs[name].resetFields();
            vm.modalXgData = {
                id: vm.nowData.id,
                authName: vm.nowData.authName,
                authPath: vm.nowData.authPath,
                url: vm.nowData.url,
                description: vm.nowData.description,
                orders: vm.nowData.orders,
                status: vm.nowData.status,
                icon: vm.nowData.icon,
            }
        }, //修改模态框重置
        modalXgXg(name) {
            var vm = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(vm.modalXgData.status == '正常'){
                        vm.modalXgData.status = 0
                    }else{
                        vm.modalXgData.status = 1
                    }
                    let arr = vm.modalXgData;
                    httpConfig.post('/auth/update',arr,function(data){
                        vm.getPowerList();
                        vm.modalXg = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //修改模态框修改
    },
    computed:{
        dataCount(){
            return this.totalLists.length;
        } //计算总数据量
    },
    watch: {
        totalLists(){
            var start = (this.nowPage - 1) * this.pageSize;
            var end = this.nowPage * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
        },
    },
}
</script>


<style scoped>
    *{
        box-sizing: border-box;
        font-size: 12px;
        line-height: 1.8;
    }
    .border-box{
        float: left;
        background: #fff;
        min-height: 600px;
        border-radius: 3px;
        border: 1px solid #e4e2e2;
        padding: 16px;
        width: 100%;
    }
    .title-container{
        position: relative;
        border-left: 4px solid #00acac;
        padding: 0 10px;
        height: 20px;
        line-height: 20px;
        font-size: 1rem;
    }
    .btn{
        margin-left: 10px;
    }
</style>
