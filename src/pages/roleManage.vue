<template>
    <div style="width:100%;height:100%;">
        <div class="border-box" style="width:55%;">
             <!-- title -->
            <div class="title-container">
                角色列表
            </div>
            <!-- 按钮以及查询的输入框 -->
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;">
                <i-input  v-show="nickPowerControl.roleListByRole" v-model="selectInput" placeholder="请输入角色名称" style="width: 300px" />
                <i-button v-show="nickPowerControl.roleListByRole" class="btn" @click="select">查询</i-button>
                <!-- 以下是新增按钮以及其模态框 -->
                <i-button v-show="nickPowerControl.roleAdd" class="btn" type="primary" @click="modalXzClick">新增</i-button>
                <modal
                    v-model="modalXz"
                    title="新增"
                    class="modal"
                    width="800">
                    <i-form :label-width="120" :rules="xzRule" :model="modalXzData" ref="modalXzData">
                        <row>
                            <i-col span="24">
                                <form-item label="组织机构" prop="orgIds">
                                    <i-select v-model="modalXzData.orgIds" multiple>
                                        <i-option v-for="item in orgLists" :value="item.id" :key="item.id" 
                                            v-html="item.orgNameWithSpace"
                                            :label="item.orgName">
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="角色名称" prop="roleName">
                                    <i-input v-model="modalXzData.roleName" placeholder="请输入角色名称" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="备注" prop="remark">
                                    <i-input v-model="modalXzData.remark" placeholder="请输入备注" />
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
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXzCz('modalXzData')">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXzXz('modalXzData')">新增</i-button>
                    </div>
                </modal>
            </div>
            <!-- 表格 -->
            <div  style="width:100%;overflow-y:auto;height:calc(100% - 130px);">
                <i-table border highlight-row :columns="columns" :data="showLists"
                    @on-row-click="changeData"
                    v-show="nickPowerControl.rolePage"></i-table>
                <!-- 修改 -->
                <modal
                    v-model="modalXg"
                    title="修改"
                    class="modal"
                    width="800">
                    <i-form :label-width="120" :rules="xgRule" :model="modalXgData" ref="modalXgData">
                        <row>
                            <i-col span="24">
                                <form-item label="组织机构" prop="orgIds">
                                    <i-select v-model="modalXgData.orgIds" multiple>
                                        <i-option v-for="item in orgLists" :value="item.id" :key="item.id">{{item.orgName}}</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="角色名称" prop="roleName">
                                    <i-input v-model="modalXgData.roleName" placeholder="请输入角色名称" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="备注" prop="remark">
                                    <i-input v-model="modalXgData.remark" placeholder="请输入备注" />
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="状态" prop="status">
                                    <radio-group v-model="modalXgData.status">
                                        <radio label="正常"></radio>
                                        <radio label="停用"></radio>
                                    </radio-group>
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
                        <span>确定要删除该角色吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="roleDelete">删除</i-button>
                    </div>
                </modal>
            </div>
            <!-- 下面控制页码 -->
            <div style="width:100%;margin-top:16px;">
                <page :total="dataCount" :page-size="pageSize" 
                @on-change="changePage"
                style="float:right;"
                v-show="nickPowerControl.rolePage"
                show-total
                :current="nowPage"/>
            </div>
        </div>
        <div class="border-box" style="width:43%;margin-left:16px;">
            <!-- title -->
            <div class="title-container">
                拥有权限
            </div>
            <!-- 编辑按钮 -->
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;" v-if="changeBtn">
                <i-button v-show="nickPowerControl.editAuth" class="btn" type="primary" @click="treeDisabledFalse(dataTree)">编辑</i-button>
            </div>
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;" v-if="!changeBtn">
                <i-button class="btn" @click="cancel">取消</i-button>
                <i-button class="btn" type="primary" @click="save">保存</i-button>
            </div>
            <!-- 树状图 -->
            <div v-show="nickPowerControl.roleListAuth" style="width:100%;border: 1px solid #e4e2e2;border-radius:3px;overflow-y:auto;height:calc(100% - 90px);">
                <tree :data="dataTree" show-checkbox @on-check-change="selectPower" ref="userPower"></tree>
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
            selectInput: '', //查询input的值
            columns: [
                { title: '编号',key: 'id', },
                { title: '角色名称',key: 'roleName' },
                { title: '创建时间',key: 'createTime',width: 150 },
                { title: '备注',key: 'remark' },
                { title: '状态',key: 'status' },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
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
                                    display: this.nickPowerControl.roleUpdate? 'inline-block' : 'none'
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
                                    display: this.nickPowerControl.roleDel? 'inline-block' : 'none'
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
            totalLists: [], //所有用户的数据
            showLists: [], //当页展示的用户数据
            pageSize: 10, //每页展示数量
            nowPage: 0, //当前页
            orgLists: [], //组织机构列表
            modalXz: false, //控制新增模态框的显示
            modalDelete: false, //控制删除模态框的显示
            modalXg: false, //控制修改模态框的显示
            modalXzData: {
                orgIds: [],
                roleName: '',
                remark: '',
                status: '正常'
            }, //新增模态框的数据
            modalXgData: {}, //修改模态框的数据
            xzRule: {
                orgIds: [
                    { type:'array',  required: true, message: '组织机构不能为空', trigger: 'blur' }
                ],
                roleName: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ],
            }, //新增模态框规则
            xgRule: {
                roleName: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ],
            }, //修改模态框规则
            nowData: {}, //当前选中用户 用于修改和删除时定位
            nowDataId: {}, //当前选中用户的id 用于保存权限
            dataTree: [], //权限树
            nowUserPowerTemp: [],
            nowPowerData: [], //当前选中的权限
            tempData: [], //保存当前角色的权限
            changeBtn: true, //切换编辑/（取消、保存）按钮
            nickPowerControl:{
                rolePage: false,
                roleListByRole: false,
                roleAdd: false,
                roleUpdate: false,
                roleDel: false,
                roleListAuth: false,
                editAuth: false,
            }, //小权限按钮的显示与否控制
        }
    },
    methods:{
        getRoleList(){
            let arr = {};
            var vm = this;
            httpConfig.post('/role/page',arr,function(data){
                vm.totalLists = data.result.list;
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else{
                        items.status = "停用";
                    }
                })
            })
        }, //获得所有角色信息
        changePage(index){
            var start = (index - 1) * this.pageSize;
            var end = index * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
            this.nowPage = index;
        }, //换页
        select(){
            var vm = this;
            let arr = {roleName: vm.selectInput};
            httpConfig.post('/role/listByName',arr,function(data){
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
        }, //按照角色名字查询角色信息
        modalXzClick(){
            var vm = this;
            let arr = {};
            httpConfig.post('/org/listAllName',arr,function(data){
                vm.orgLists = data.result;
                vm.orgLists.forEach(items => {
                    items.orgNameWithSpace = items.orgName;
                    for(var i = 0;i < items.levalId - 1;i ++){
                        items.orgNameWithSpace = '&nbsp;&nbsp;&nbsp;&nbsp;' + items.orgNameWithSpace;
                    }
                });
                vm.modalXz = true;
            })
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
                    // arr.orgIds = JSON.stringify(arr.orgIds);
                    httpConfig.postJson('/role/add',arr,function(data){
                        vm.getRoleList();
                        vm.modalXz = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //新增模态框新增
        remove(index){
            var vm = this;
            vm.nowData = {
                id: vm.showLists[index].id,
            }
            vm.modalDelete = true;
        }, //删除按钮单击
        roleDelete(){
            var vm = this;
            let arr = vm.nowData;
            httpConfig.post('/role/delete',arr,function(){
                if(vm.showLists.length == 1){
                    vm.nowPage -= 1;
                }
                vm.getRoleList();
                vm.modalDelete = false;
                vm.$Message.success('Success!');
            })
        }, //删除模态框确认删除
        modify(index){
            var vm = this;
            let arr = {};
            httpConfig.post('/org/listAllName',arr,function(data){
                vm.orgLists = data.result;
                let arr2 = {
                    roleId: vm.showLists[index].id
                }
                httpConfig.post('/org/listByRole',arr2,function(data){
                    vm.nowData = vm.showLists[index];
                    var temp = [];
                    data.result.forEach(items => {
                        temp.push(items.id)
                    });
                    vm.nowData.orgIds = temp;
                    vm.modalXgData = {
                        id: vm.nowData.id,
                        orgIds: vm.nowData.orgIds,
                        roleName: vm.nowData.roleName,
                        remark: vm.nowData.remark,
                        status: vm.nowData.status
                    }
                    vm.modalXg = true;
                })
            })
        }, //修改按钮单击
        modalXgCz(name){
            var vm = this;
            vm.$refs[name].resetFields();
            vm.modalXgData = {
                orgIds: vm.nowData.orgIds,
                roleName: vm.nowData.roleName,
                remark: vm.nowData.remark,
                status: vm.nowData.status
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
                    // arr.orgIds = JSON.stringify(arr.orgIds);
                    httpConfig.postJson('/role/update',arr,function(data){
                        vm.getRoleList();
                        vm.modalXg = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //修改模态框修改
        changeData(index){
            var vm = this;
            vm.treeCheckedFalse(vm.dataTree);
            let arr = {
                id: index.id
            }
            vm.treeDisabledTrue(vm.dataTree);
            vm.nowDataId = arr;
            httpConfig.post('/role/listAuth',arr,function(data){
                vm.nowUserPowerTemp = data.result;
                vm.getNowPower(vm.dataTree,data.result);
            })
        }, //选中一个角色
        getTreeList(index){
            var vm = this;
            httpConfig.post('/auth/listAll',{},function(data){
                var tmp = data.result;
                tmp = JSON.parse(JSON.stringify(tmp).replace(/authName/g,"title"));
                var tmplv1 = [];
                var tmplv2 = [];
                var tmplv3 = [];
                tmp.forEach(items => {
                    items.children = [];
                    items.expand = true;
                    items.checked = false;
                    items.disabled = true;
                    if(items.levalId == 2){
                        tmplv2.push(items);
                    }else if(items.levalId == 3){
                        tmplv3.push(items);
                    }else{
                        tmplv1.push(items);
                    }
                })
                var temp = [];
                tmplv3.forEach(items3 => {
                    tmplv2.forEach(items2 => {
                        if(items3.superiorAuthId == items2.id){
                            items2.children.push(items3);
                            return false;
                        }
                    })
                })
                tmplv2.forEach(items2 => {
                    tmplv1.forEach(items1 => {
                        if(items2.superiorAuthId == items1.id){
                            items1.children.push(items2);
                            return false;
                        }
                    })
                })
                tmplv1.forEach(items => {
                    temp.push(items);
                })
                vm.dataTree = temp;
            })
        }, //获得权限树列表
        treeDisabledFalse(obj){
            var vm = this;
            obj.forEach(element => {
                if(element.children.length != 0){
                    vm.treeDisabledFalse(element.children);
                }
                element.disabled = false;
            });
            vm.changeBtn = false;
        }, //将树设为可选中,并切换按钮
        treeDisabledTrue(obj){
            var vm = this;
            obj.forEach(element => {
                if(element.children.length != 0){
                    vm.treeDisabledTrue(element.children);
                }
                element.disabled = true;
            });
            vm.changeBtn = true;
        }, //将树设为不可选中,并切换按钮
        treeCheckedFalse(obj){
            var vm = this;
            obj.forEach(element => {
                if(element.children.length != 0){
                    if(element.indeterminate == true){
                        element.indeterminate = false;
                    }
                    vm.treeCheckedFalse(element.children);
                }
                element.checked = false;
            });
        }, //将树设为均未被选中
        selectPower(index){
            var vm = this;
            vm.nowPowerData = index;
        }, //当勾选节点时
        getNowPower(obj,lists){
            var vm = this;
            // vm.treeCheckedFalse(vm.dataTree);
            lists.forEach(element => {
                obj.forEach(items => {
                    if(items.id == element){
                        items.checked = true;
                        return false;
                    }
                    if(items.children.length != 0){
                        vm.getNowPower(items.children,lists)
                    }
                });
            });
        }, //获得当前拥有的权限
        save(){
            var vm = this;
            var tmp = vm.$refs.userPower.getCheckedAndIndeterminateNodes();
            let arr = {
                id: vm.nowDataId.id,
                authIds: [],
            }
            tmp.forEach(items => {
                arr.authIds.push(items.id)
            });
            // arr.authIds = JSON.stringify(arr.authIds);
            httpConfig.postJson('/role/saveAuth',arr,function(data){
                vm.treeDisabledTrue(vm.dataTree);
                vm.$Message.success('Success!');
            })
        }, //保存当前选中权限
        cancel(){
            var vm = this;
            vm.treeCheckedFalse(vm.dataTree);
            vm.treeDisabledTrue(vm.dataTree);
            // console.log(vm.nowUserPowerTemp);
            vm.getNowPower(vm.dataTree,vm.nowUserPowerTemp);
        }
    },
    mounted: function(){
        var vm = this;
        var tmp = common.getSession('nickName');
        tmp.forEach(items => {
            vm.$set(vm.nickPowerControl,items.nickName,true);
        });
        vm.getRoleList();
        vm.getTreeList();
        vm.changePage(1);
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
        }
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
        /* min-height: 600px; */
        height: 100%;
        border-radius: 3px;
        border: 1px solid #e4e2e2;
        padding: 16px;
    }
    .title-container{
        position: relative;
        border-left: 4px solid #00acac;
        padding: 0 10px;
        height: 20px;
        line-height: 20px;
        font-size: 1rem;
        /* margin-top: 15px; */
    }
    .btn{
        margin-left: 10px;
    }
</style>
