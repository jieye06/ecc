<template>
    <div style="width:100%;height:100%;overflow:auto">
        <div class="border-box">
            <!-- titile -->
            <div class="title-container">
                组织管理
            </div>
            <!-- 按钮模块 -->
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;">
                <!-- 以下是查询按钮以及其模态框 -->
                <i-button v-show="nickPowerControl.orgListByOrg" class="btn" @click="modalCx=true">查询</i-button>
                <modal
                    v-model="modalCx"
                    title="查询"
                    width="600"
                    class="modal">
                    <i-form :label-width="120" :model="modalCxData" ref="modalCxData">
                        <row>
                            <i-col span="12">
                                <form-item label="组织机构名称" prop="name">
                                    <i-input v-model="modalCxData.name" placeholder="请输入组织机构名称"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="组织机构编码" prop="code">
                                    <i-input v-model="modalCxData.code" placeholder="请输入组织机构编码"/>
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalCxCz">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalCxCx">查询</i-button>
                    </div>
                </modal>
                <!-- 以下是新增按钮以及其模态框 -->
                <i-button v-show="nickPowerControl.orgAdd" class="btn" type="primary" @click="modalXzClick">新增</i-button>
                <modal
                    :mask-closable="false"
                    v-model="modalXz"
                    title="新增"
                    width="800"
                    class="modal">
                    <i-form :label-width="120" :rules="xzRule" :model="modalXzData" ref="modalXzData">
                        <row>
                            <i-col span="12">
                                <form-item label="组织机构名称" prop="orgName">
                                    <i-input v-model="modalXzData.orgName" placeholder="请输入组织机构名称"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="父级组织机构" prop="superiorId">
                                    <i-select v-model="modalXzData.superiorId">
                                        <i-option v-for="item in parentName" :value="item.id" :key="item.id" 
                                            v-html="item.orgNameWithSpace" 
                                            :label="item.orgName">
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="组织机构编码" prop="orgCode">
                                    <i-input v-model="modalXzData.orgCode" placeholder="请输入组织机构编码"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="排序" prop="order">
                                    <input-number :min="0" v-model="modalXzData.order" placeholder="请输入排序"/>
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
                                <form-item label="备注" prop="remark">
                            <i-input v-model="modalXzData.remark" placeholder="请输入备注"/>
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
            <!-- 下面是表格模块 -->
            <div style="width:100%;" >
                <i-table border disabled-hover :columns="columns" :data="showLists" v-show="nickPowerControl.orgPage"></i-table>
                <!-- 下面是修改按钮模态框 -->
                <modal
                    :mask-closable="false"
                    v-model="modalXg"
                    width="800"
                    title="修改"
                    class="modal">
                    <i-form :label-width="120" :model="modalXgData" ref="modalXgData" :rules="xgRule">
                        <row>
                            <i-col span="12">
                                <form-item label="组织机构名称" prop="orgName">
                                    <i-input v-model="modalXgData.orgName" placeholder="请输入组织机构名称"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="组织机构编码" prop="orgCode">
                                    <i-input v-model="modalXgData.orgCode" placeholder="请输入组织机构编码"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="排序" prop="order">
                                    <input-number :min="0" v-model="modalXgData.order" placeholder="请输入排序"/>
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
                                <form-item label="备注" prop="remark">
                                    <i-input v-model="modalXgData.remark" placeholder="请输入备注"/>
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <!-- <div>
                        <div style="padding-bottom:16px;">
                            <label><span style="color:red;">*</span>组织机构名称</label>
                            <i-input v-model="modalXgData.orgName" placeholder="请输入组织机构名称" style="width: 30%;" />
                            <label>组织机构编码</label>
                            <i-input v-model="modalXgData.orgCode" placeholder="请输入组织机构编码" style="width: 30%;" />
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>排序</label>
                            <input-number :min="0" v-model="modalXgData.order" placeholder="请输入排序" style="width: 30%;" />
                            <label>状态</label>
                            <radio-group v-model="modalXgData.status" style="width: 30%;">
                                <radio label="正常" style="width:40%;"></radio>
                                <radio label="停用" style="width:40%;"></radio>
                            </radio-group>
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>备注</label>
                            <i-input v-model="modalXgData.remark" placeholder="请输入备注" style="width: 30%;" />
                        </div>
                    </div> -->
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXgCz('modalXgData')">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXgXg('modalXgData')">修改</i-button>
                    </div>
                </modal>
                <!-- 下面是删除按钮模态框 -->
                <modal
                    v-model="modalDelete"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要删除该组织机构吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="orgDelete">删除</i-button>
                    </div>
                </modal>
            </div>
            <!-- 下面控制页码 -->
            <div style="width:100%;margin-top:16px;">
                <page :total="dataCount" :page-size="pageSize" 
                @on-change="changePage" 
                style="float:right;" 
                v-show="nickPowerControl.orgPage"
                :current="nowPage"
                show-total/>
            </div>
        </div>
    </div>
</template>

<script>
import httpConfig from '../http/httpConfig.js'
import common from '../JS/common.js'
export default {
    data () {
        return {
            columns: [
                { title: '编号',key: 'id' },
                { title: '组织机构编码',key: 'orgCode' },
                { title: '组织机构名称',key: 'orgName' },
                { title: '状态',key: 'status' },
                { title: '创建时间',key: 'createTime' },
                { title: '备注',key: 'remark' },
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
                                    size: 'small',
                                },
                                style: {
                                    marginRight: '5px',
                                    display: this.nickPowerControl.orgUpdate? 'inline-block' : 'none'
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
                                    display: this.nickPowerControl.orgDel? 'inline-block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        // this.modalDelete = true;
                                        this.remove(params.index);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ], //列表的表头
            totalLists: [], //列表信息
            showLists: [], //用户展示显示的列表
            pageSize: 10, //每页展示数量
            nowPage: 0, //当前页
            modalCx: false, //控制查询页面的显示
            modalXz: false, //控制新增页面的显示
            modalXg: false, //控制修改模态框的显示
            modalDelete: false, //控制删除模态框的显示
            modalCxData: {
                name: '', 
                code: '', 
            }, //查询模态框需要的数据
            modalXzData: {
                orgName: '',
                superiorId: '',
                orgCode: '',
                order: 0,
                status: '正常',
                remark: ''
            }, //新增模态框需要的数据
            modalXgData: {
                id: '',
                orgCode: '',
                orgName: '',
                status: '',
                remark: '',
                order: 0,
            }, //修改模态框需要的数据
            nowData: {}, //当前选中的用户
            parentName: [], //父级组织列表
            xzRule: {
                orgName: [
                    { required: true, message: '组织机构编码不能为空', trigger: 'blur' }
                ],
            }, //新增模态框规则
            xgRule: {
                orgName: [
                    { required: true, message: '组织机构编码不能为空', trigger: 'blur' }
                ],
            }, //修改模态框规则
            nickPowerControl:{
                orgPage: false,
                orgAdd: false,
                orgListByOrg: false,
                orgUpdate: false,
                orgDel: false,
            }, //小权限按钮的显示与否控制
        }
    },
    mounted: function(){
        var vm = this;
        var tmp = common.getSession('nickName');
        tmp.forEach(items => {
            vm.$set(vm.nickPowerControl,items.nickName,true);
        });
        vm.getOrgList();
        vm.changePage(1);
    },
    methods: {
        getOrgList(){
            let arr = {};
            var vm = this;
            httpConfig.post('/org/page',arr,function(data){
                vm.totalLists = data.result;
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else{
                        items.status = "停用";
                    }
                })
            })
        },//获取组织机构列表
        modify (index) {
            var vm = this;
            vm.modalXgData.id = vm.showLists[index].id;
            vm.modalXgData.orgCode = vm.showLists[index].orgCode;
            vm.modalXgData.orgName = vm.showLists[index].orgName;
            vm.modalXgData.status = vm.showLists[index].status;
            vm.modalXgData.remark = vm.showLists[index].remark;
            vm.nowData = vm.showLists[index];
            // debugger
            vm.modalXg = true;
        }, //修改按钮事件
        remove (index) {
            this.modalDelete = true;
            this.nowData = {
                index: index
            }
        }, //删除按钮事件
        modalXgCz(index){
            var vm = this;
            vm.$refs[index].resetFields();
            vm.modalXgData = {
                id: vm.nowData.id,
                orgCode: vm.nowData.orgCode,
                orgName: vm.nowData.orgName,
                status: vm.nowData.status,
                remark: vm.nowData.remark,
                order: vm.nowData.order,
            };
        }, //修改模态框重置按钮事件
        modalXgXg(index){
            var vm = this;
            vm.$refs[index].validate((valid) => {
                if (valid) {
                    var arr = vm.modalXgData;
                    if (arr.status == '正常'){
                        arr.status = 0;
                    }else{
                        arr.status = 1;
                    }
                    httpConfig.post('/org/update',arr,function(data){
                        vm.getOrgList();
                        vm.modalXg = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //修改模态框修改按钮
        orgDelete (index) {
            var vm = this;
            var arr = { id: vm.showLists[vm.nowData.index].id};
            httpConfig.post('/org/delete',arr,function(data){
                if(vm.showLists.length == 1){
                    vm.nowPage -= 1;
                }
                vm.getOrgList();
                vm.modalDelete = false;
            })
        }, //删除当条信息
        changePage(index){
            // this.showLists = [];
            var start = (index - 1) * this.pageSize;
            var end = index * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
            this.nowPage = index;
        }, //换页
        modalCxCz(index){
            this.modalCxData.id = '';
            this.modalCxData.name = '';
        }, //查询模态框重置
        modalCxCx(index){
            let arr = {
                orgName: this.modalCxData.name,
                orgCode: this.modalCxData.code
            }
            var vm = this;
            httpConfig.post('/org/listByOrg',arr,function(data){
                // vm.nowPage = 1;
                vm.totalLists = data.result;
                vm.changePage(1);
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else{
                        items.status = "停用";
                    }
                });
                vm.modalCx = false;
            })
        }, //查询模态框查询
        modalXzClick(index){
            let arr = {};
            var vm = this;
            // vm.modalXzCz(vm.modalXzData);
            httpConfig.post('/org/listAllName',arr,function(data){
                vm.parentName = data.result;
                vm.parentName.forEach(items => {
                    items.orgNameWithSpace = items.orgName;
                    for(var i = 0;i < items.levalId - 1;i ++){
                        items.orgNameWithSpace = '&nbsp;&nbsp;&nbsp;&nbsp;' + items.orgNameWithSpace;
                    }
                });
                vm.modalXz = true;
            })
        }, //新增模态框单击
        modalXzCz(index){
            this.$refs[index].resetFields();
        }, //新增模态框重置
        modalXzXz(index){
            var vm = this;
            vm.$refs[index].validate((valid) => {
                if (valid) {
                    if(vm.modalXzData.status == '正常'){
                        vm.modalXzData.status = 0
                    }else{
                        vm.modalXzData.status = 1
                    }
                    let arr = vm.modalXzData;
                    httpConfig.post('/org/add',arr,function(data){
                        vm.getOrgList();
                        vm.modalXz = false;
                        vm.$Message.success('Success!');
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
        }, //新增模态框新增按钮事件
    },
    computed: {
        dataCount(){
            return this.totalLists.length;
        } //计算总数据量
    },
    watch: {
        totalLists(){
            // this.showLists = [];
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
