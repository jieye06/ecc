<template>
    <div style="width:100%;height:100%;overflow:auto">
        <div class="border-box" style="width:68%;">
            <div class="title-container">
                用户管理
            </div>
            <!-- 下面是操作按钮部分 -->
            <div style="height:32px;line-height:32px;text-align:right;margin:16px 0;">
                <!-- 下面是查询按钮以及模态框 -->
                <i-button v-show="nickPowerControl.userListByUser" class="btn" @click="modalCx = true">查询</i-button>
                <modal
                    v-model="modalCx"
                    title="查询"
                    class="modal">
                    <i-form :label-width="80" inline>
                        <row>
                            <i-col span="12">
                                <form-item label="工号" required>
                                    <i-input v-model="modalCxData.empno" placeholder="请输入工号" />
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="姓名">
                                    <i-input v-model="modalCxData.name" placeholder="请输入姓名" />
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalCxCz">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalCxCx">查询</i-button>
                    </div>
                </modal>
                <!-- 下面是新增按钮以及模态框 -->
                <i-button v-show="nickPowerControl.userAdd" class="btn" type="primary" @click="modalXzClick">新增</i-button>
                <modal
                    :mask-closable="false"
                    v-model="modalXz"
                    title="新增"
                    width="600"
                    class="modal">
                    <i-form :label-width="80" :rules="xzRule" :model="modalXzData" ref="modalXzData">
                        <row>
                            <i-col span="12">
                                <form-item label="工号" prop="empno">
                                    <i-input v-model="modalXzData.empno" placeholder="请输入工号"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="姓名" prop="name">
                                    <i-input v-model="modalXzData.name" placeholder="请输入姓名"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="职位" prop="job">
                                    <i-input v-model="modalXzData.job" placeholder="请输入职位"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="出生年月" prop="birthday">
                                    <date-picker v-model="modalXzData.birthday" type="date" placeholder="请选择出生年月"  
                                        @on-change="modalXzData.birthday=$event">
                                    </date-picker>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="性别" prop="gender">
                                    <radio-group v-model="modalXzData.gender">
                                        <radio label="女"></radio>
                                        <radio label="男"></radio>
                                    </radio-group>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="邮箱" prop="email">
                                    <i-input v-model="modalXzData.email" placeholder="请输入邮箱"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="手机号码" prop="mobile">
                                    <i-input v-model="modalXzData.mobile" placeholder="请输入手机号码"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="QQ" prop="qq">
                                    <i-input v-model="modalXzData.qq" placeholder="请输入QQ"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="24">
                                <form-item label="所属机构" prop="orgList">
                                    <i-select v-model="modalXzData.orgList" multiple>
                                        <i-option v-for="item in parentOrg" 
                                            :value="item.id" 
                                            :key="item.id"
                                            v-html="item.orgNameWithSpace"
                                            :label="item.orgName">
                                        </i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="24">
                                <form-item label="所属角色" prop="roleList">
                                    <i-select v-model="modalXzData.roleList" multiple>
                                        <i-option v-for="item in parentRole" :value="item.id" :key="item.id">{{ item.roleName }}</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="备注" prop="remark">
                                    <i-input v-model="modalXzData.remark" placeholder="请输入备注"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="同时在线数" prop="numSametimeOnline">
                                    <input-number :min="1" v-model="modalXzData.numSametimeOnline" placeholder="请输入同时在线个数"/>
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXzCz('modalXzData')">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXzXz('modalXzData')">新增</i-button>
                    </div>
                </modal>
                <i-button v-show="nickPowerControl.userStop" class="btn" type="primary" @click="modalQy = true">启用/停用</i-button>
                <!-- 下面是启用/停用按钮模态框 -->
                <modal
                    v-model="modalQy"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要启用或停用该用户吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalQy = false">取消</i-button>
                        <i-button class="btn" type="primary" @click="modalQyQy">启用/停用</i-button>
                    </div>
                </modal>
                <i-button v-show="nickPowerControl.userFrozen" class="btn" type="primary" @click="modalJd = true">解冻/冻结</i-button>
                <!-- 下面是启用/停用按钮模态框 -->
                <modal
                    v-model="modalJd"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要解冻或冻结该用户吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalJd = false">取消</i-button>
                        <i-button class="btn" type="primary" @click="modalJdJd">解冻/冻结</i-button>
                    </div>
                </modal>
                <i-button v-show="nickPowerControl.pwdReset" class="btn" type="primary" @click="modalCz = true">重置密码</i-button>
                <!-- 下面是启用/停用按钮模态框 -->
                <modal
                    v-model="modalCz"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要重置该用户密码吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalCz = false">取消</i-button>
                        <i-button class="btn" type="primary" @click="modalCzCz">重置密码</i-button>
                    </div>
                </modal>
            </div>
            <!-- 下面是表格部分 -->
            <div style="width:100%;">
                <i-table border highlight-row ref="selection" :columns="columns" :data="showLists" 
                    @on-row-click="changeData"
                    @on-selection-change="selectChange"
                    v-show="nickPowerControl.userPage"></i-table>
                <!-- 下面是修改按钮模态框 -->
                <modal
                    :mask-closable="false"
                    v-model="modalXg"
                    title="修改"
                    width="600"
                    class="modal">
                    <i-form :label-width="80" :model="modalXgData" ref="modalXgData">
                        <row>
                            <i-col span="12">
                                <form-item label="工号" prop="empno">
                                    <i-input v-model="modalXgData.empno" placeholder="请输入工号"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="姓名" prop="name">
                                    <i-input v-model="modalXgData.name" placeholder="请输入姓名"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="职位" prop="job">
                                    <i-input v-model="modalXgData.job" placeholder="请输入职位"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="出生年月" prop="birthday">
                                    <date-picker v-model="modalXgData.birthday" type="date" placeholder="请选择出生年月"
                                        @on-change="modalXgDateTemp=$event">
                                    </date-picker>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="性别" prop="gender">
                                    <radio-group v-model="modalXgData.gender">
                                        <radio label="女" ></radio>
                                        <radio label="男" ></radio>
                                    </radio-group>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="邮箱" prop="email">
                                    <i-input v-model="modalXgData.email" placeholder="请输入邮箱"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="手机号码" prop="mobile">
                                    <i-input v-model="modalXgData.mobile" placeholder="请输入手机号码"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="QQ" prop="qq">
                                    <i-input v-model="modalXgData.qq" placeholder="请输入QQ"/>
                                </form-item>
                            </i-col>
                        </row>
                        <row>
                            <i-col span="12">
                                <form-item label="备注" prop="remark">
                                    <i-input v-model="modalXgData.remark" placeholder="请输入备注"/>
                                </form-item>
                            </i-col>
                            <i-col span="12">
                                <form-item label="在线个数" prop="numSametimeOnline">
                                    <input-number :min="1" v-model="modalXgData.numSametimeOnline" placeholder="请输入同时在线个数"/>
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                    <!-- <div>
                        <div style="padding-bottom:16px;">
                            <label>工号</label>
                            <i-input v-model="modalXgData.empno" placeholder="请输入工号" style="width: 30%;" />
                            <label>姓名</label>
                            <i-input v-model="modalXgData.name" placeholder="请输入姓名" style="width: 30%;" />
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>职位</label>
                            <i-input v-model="modalXgData.job" placeholder="请输入职位" style="width: 30%;" />
                            <label>出生年月</label>
                            <date-picker v-model="modalXgData.birthday" type="date" placeholder="请选择出生年月" style="width: 30%;" @on-change="modalXgDateTemp=$event"></date-picker>
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>性别</label>
                            <radio-group v-model="modalXgData.gender" style="width: 30%;">
                                <radio label="女" style="width:40%;"></radio>
                                <radio label="男" style="width:40%;"></radio>
                            </radio-group>
                            <label>邮箱</label>
                            <i-input v-model="modalXgData.email" placeholder="请输入邮箱" style="width: 30%;" />
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>手机号码</label>
                            <i-input v-model="modalXgData.mobile" placeholder="请输入手机号码" style="width: 30%;" />
                            <label>QQ</label>
                            <i-input v-model="modalXgData.qq" placeholder="请输入QQ" style="width: 30%;" />
                        </div>
                        <div style="padding-bottom:16px;">
                            <label>在线个数</label>
                            <i-input v-model="modalXgData.numSametimeOnline" placeholder="请输入在线个数" style="width: 30%;" />
                            <label>备注</label>
                            <i-input v-model="modalXgData.remark" placeholder="请输入备注" style="width: 30%;" />
                        </div>
                    </div> -->
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalXgCz">重置</i-button>
                        <i-button class="btn" type="primary" @click="modalXgXg">修改</i-button>
                    </div>
                </modal>
                <!-- 下面是删除按钮模态框 -->
                <modal
                    v-model="modalDelete"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要删除该用户吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="userDelete">删除</i-button>
                    </div>
                </modal>
            </div>
            <!-- 下面的div控制页码 -->
            <div style="width:100%;margin-top:16px;">
                <page :total="dataCount" :page-size="pageSize" 
                @on-change="changePage" 
                style="float:right;" 
                v-show="nickPowerControl.userPage"
                show-total
                :current="nowPage"/>
            </div>
        </div>
        <!-- 右侧详情 -->
        <div class="border-box" style="width:30%;margin-left:16px;">
            <!-- 下面是员工详情部分 -->
            <div class="title-container">
                详情
            </div>
            <div v-show="nickPowerControl.userView">
                <div class="message-box">
                    <div class="message-box-container">
                        <div :title="nowData.id">
                            编号：{{ nowData.id? nowData.id : "--" }}
                        </div>
                        <div :title="nowData.email">
                            邮箱：{{ nowData.email? nowData.email : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.empno">
                            工号：{{ nowData.empno? nowData.empno : "--" }}
                        </div>
                        <div :title="nowData.qq">
                            QQ：{{ nowData.qq? nowData.qq : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.name">
                            姓名：{{ nowData.name? nowData.name : "--" }}
                        </div>
                        <div :title="nowData.mobile">
                            手机号码：{{ nowData.mobile? nowData.mobile : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.birthday">
                            出生年月：{{ nowData.birthday? nowData.birthday : "--" }}
                        </div>
                        <div :title="nowData.job">
                            职位：{{ nowData.job? nowData.job : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.gender">
                            性别：{{ nowData.gender? nowData.gender : "--" }}
                        </div>
                        <div :title="nowData.status">
                            状态：{{ nowData.status? nowData.status : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.timesPwdErr">
                            密码错误次数：{{ nowData.timesPwdErr != undefined? nowData.timesPwdErr : "--" }}
                        </div>
                        <div :title="nowData.numSametimeOnline">
                            允许同时在线个数：{{ nowData.numSametimeOnline? nowData.numSametimeOnline : "--" }}
                        </div>
                    </div>
                    <div class="message-box-container">
                        <div :title="nowData.timeLastLogin">
                            上次登录时间：{{ nowData.timeLastLogin? nowData.timeLastLogin : "--" }}
                        </div>
                        <div :title="nowData.remark">
                            备注：{{ nowData.remark? nowData.remark : "--" }}
                        </div>
                    </div>
                </div>
                <!-- 下面是关联机构部分 -->
                <div class="title-container" style="margin-top:15px;">
                    关联机构
                    <div style="position:absolute;top:-5px;right:10px;">
                        <i-button v-show="nickPowerControl.userAddOrg" class="btn" type="primary" style="height:28px;" @click="modalOrgClick">添加</i-button>
                    </div>
                </div>
                <div class="message-box">
                    <div style="width:100%;">
                        <i-table disabled-hover border :columns="nowOrgListColumns" :data="nowOrgList" ></i-table>
                    </div>
                </div>
                <!-- 关联机构模态框 -->
                <modal
                    v-model="modalOrg"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <tree :data="glOrgList" show-checkbox @on-check-change="changeGlOrg"></tree>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalOrg = false">取消</i-button>
                        <i-button class="btn" type="primary" @click="addOrg">关联机构</i-button>
                    </div>
                </modal>
                <!-- 移除关联机构 模态框 -->
                <modal
                    v-model="modalGlOrgDelete"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要删除该关联机构吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalGlOrgDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="modalGlOrgDeleteDelete">删除</i-button>
                    </div>
                </modal>
                <!-- 下面是关联角色部分 -->
                <div class="title-container" style="margin-top:15px;">
                    关联角色
                    <div style="position:absolute;top:-5px;right:10px;">
                        <i-button v-show="nickPowerControl.userAddRole" class="btn" type="primary" style="height:28px;" @click="modalRoleClick">添加</i-button>
                    </div>
                </div>
                <div class="message-box" style="border-bottom: none;">
                    <div style="width:100%;">
                        <i-table disabled-hover border :columns="nowRoleListColumns" :data="nowRoleList" ></i-table>
                    </div>
                </div>
                <!-- 关联角色模态框 -->
                <modal
                    v-model="modalRole"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <i-table disabled-hover border :columns="glRoleListColumns" :data="glRoleLists"
                        @on-selection-change="changeGlRole"></i-table>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalRole = false">取消</i-button>
                        <i-button class="btn" type="primary" @click="addRole">关联角色</i-button>
                    </div>
                </modal>
                <!-- 移除关联机构 模态框 -->
                <modal
                    v-model="modalGlRoleDelete"
                    title="提示"
                    class="modal">
                    <div style="width:100%;">
                        <span>确定要删除该关联角色吗？</span>
                    </div>
                    <div slot="footer" style="width:100%;padding: 12px 18px;">
                        <i-button class="btn" @click="modalGlRoleDelete = false">取消</i-button>
                        <i-button class="btn" type="error" @click="modalGlRoleDeleteDelete">删除</i-button>
                    </div>
                </modal>
            </div>
        </div>
    </div>
</template>


<script>
import httpConfig from '../http/httpConfig'
import common from '../JS/common.js'
export default {
    data () {
        return {
            columns: [
                { type: 'selection',width: 60,align: 'center' },
                { title: '编号',key: 'id' },
                { title: '工号',key: 'empno' },
                { title: '姓名',key: 'name' },
                { title: 'QQ',key: 'qq' },
                { title: '职位',key: 'job' },
                { title: '状态',key: 'status' },
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
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
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
                                on: {
                                    click: () => {
                                        this.remove(params.index)
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
            nowData:{}, //当前选中的人的基本信息
            nowOrgListColumns: [
                { title: '机构',key: 'orgName' },
                {
                    title: '操作',
                    key: 'action1',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.glOrgDelete(params.index)
                                    }
                                }
                            }, '删除'),
                        ]);
                    }
                }
            ], //相关机构列表表头
            nowRoleListColumns: [
                { title: '角色',key: 'roleName' },
                {
                    title: '操作',
                    key: 'action1',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.glRoleDelete(params.index)
                                    }
                                }
                            }, '删除'),
                        ]);
                    }
                }
            ], //相关角色列表表头
            glRoleListColumns: [
                { type: 'selection',width: 60,align: 'center' },
                { title: '角色名称',key: 'roleName' },
            ], //添加关联角色列表表头
            glRoleLists: [], //添加关联角色列表数据
            nowOrgList: [], //当前选中的关联机构
            nowRoleList: [], //当前选中人的关联角色
            modalCx: false, //控制查询框的显示
            modalXz: false, //控制新增框的显示
            modalQy: false, //控制启用/停用框的显示
            modalJd: false, //控制解冻/冻结框的显示
            modalCz: false, //控制重置密码框的显示
            modalXg: false, //控制修改模态框的显示
            modalDelete: false, //控制删除模态框的显示
            modalRole: false, // 控制关联角色模态框的显示
            modalOrg: false, // 控制关联机构模态框的显示
            modalGlOrgDelete: false, // 控制删除关联机构模态框的显示
            modalGlRoleDelete: false, // 控制删除关联机构模态框的显示
            modalCxData: {
                empno: '', //查询模态框的工号
                name: '', //查询模态框的姓名
            }, //查询模态框需要的数据
            modalXzData: {
                empno: '',
                name: '',
                job: '',
                birthday: '',
                mobile: '',
                qq: '',
                gender: '女',
                email: '',
                remark: '',
                numSametimeOnline: 1,
                orgList: [],
                roleList: [],
            }, //新增模态框需要的数据
            parentOrg: [], //新增模态框存放关联机构的数组
            parentRole: [], //新增模态框存放关联角色的数组
            modalXgData: {
                empno: '',
                name: '',
                job: '',
                birthday: '',
                gender: '',
                email: '',
                mobile: '',
                qq: '',
                numSametimeOnline: 1,
                remark: '',
                orgList: [],
                roleList: []
            }, //修改模态框需要的数据
            modalXgTemp: {}, //临时存储修改前数据 便于重置
            modalXgDateTemp: '', //修改模态框临时存放日期的值
            selectData: {}, //勾选中的数据
            glOrgList: [], //添加关联机构树
            tempForDelete: '', //一个临时的用于删除关联机构角色的数据
            changeGlRoleData: [], //存放添加关联角色时选中的数据
            changeGlOrgData: [], //存放添加关联机构时选中的数据
            nickPowerControl:{
                userPage: false,
                userView: false,
                userListByUser: false,
                userAdd: false,
                userUpdate: false,
                userDel: false,
                userStop: false,
                userFrozen: false,
                pwdReset: false,
                userAddOrg: false,
                userAddRole: false,
            }, //小权限按钮的显示与否控制
            xzRule: {
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type:'email', message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
                ],
                empno: [
                    { required: true, message: '工号不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
            }, //新增模态框规则
        }
    },
    mounted: function(){
        var vm = this;
        var tmp = common.getSession('nickName');
        tmp.forEach(items => {
            vm.$set(vm.nickPowerControl,items.nickName,true);
        });
        vm.getUserList();
        vm.changePage(1);
    },
    methods: {
        getUserList(){
            let arr = {};
            var vm = this;
            httpConfig.post('/user/page',arr,function(data){
                vm.totalLists = data.result.list;
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else if (items.status == 1){
                        items.status = "停用";
                    }else{
                        items.status = "冻结";
                    }
                    if (items.gender == 1){
                        items.gender = "男"
                    }else{
                        items.gender = "女"
                    }
                });
            })
        }, //获取用户列表
        modify(index){
            var vm = this;
            // let arr = {id: vm.showLists[index].id};
            // httpConfig.post('/user/view',arr,function(data){
            //     vm.modalXgData = data.result.user;
            //     if(vm.modalXgData.gender == 1){
            //         vm.modalXgData.gender = '男';
            //     }else{
            //         vm.modalXgData.gender = '女';
            //     }
            //     vm.modalXgData.birthday = '';
            //     vm.modalXgTemp = {
            //         empno: vm.modalXgData.empno,
            //         name: vm.modalXgData.name,
            //         job: vm.modalXgData.job,
            //         birthday: vm.modalXgData.birthday,
            //         gender: vm.modalXgData.gender,
            //         email: vm.modalXgData.email,
            //         mobile: vm.modalXgData.mobile,
            //         qq: vm.modalXgData.qq,
            //         numSametimeOnline: vm.modalXgData.numSametimeOnline,
            //         remark: vm.modalXgData.remark
            //     };
            // })
            vm.modalXg = true;
        }, //修改按钮事件
        modalXgCz(){
            var vm = this;
            vm.modalXgData.empno = vm.modalXgTemp.empno;
            vm.modalXgData.name = vm.modalXgTemp.name;
            vm.modalXgData.job = vm.modalXgTemp.job;
            vm.modalXgData.birthday = vm.modalXgTemp.birthday;
            vm.modalXgData.gender = vm.modalXgTemp.gender;
            vm.modalXgData.email = vm.modalXgTemp.email;
            vm.modalXgData.mobile = vm.modalXgTemp.mobile;
            vm.modalXgData.qq = vm.modalXgTemp.qq;
            vm.modalXgData.numSametimeOnline = vm.modalXgTemp.numSametimeOnline;
            vm.modalXgData.remark = vm.modalXgTemp.remark;
        }, //修改模态框重置
        modalXgXg(){
            var vm = this;
            let arr = vm.modalXgData;
            arr.birthday = vm.modalXgDateTemp;
            if(arr.gender == '男'){
                arr.gender = 1
            }else{
                arr.gender = 2
            }
            if(vm.nowData.status == '正常'){
                arr.status = 0;
            }else if(vm.nowData.status == '停用'){
                arr.status = 1;
            }else{
                arr.status = 2;
            }
            httpConfig.post('/user/update',arr,function(data){
                vm.getUserList();
                vm.modalXg = false;
            })
        }, //修改模态框修改按钮
        remove (index) {
            this.modalDelete = true;
        }, //删除按钮事件
        userDelete(){
            var vm = this;
            var arr = { id: this.nowData.id};
            httpConfig.post('/user/delete',arr,function(data){
                if(vm.showLists.length == 1){
                    vm.nowPage -= 1;
                }
                vm.getUserList();
                vm.modalDelete = false;
            })
        }, //删除用户
        selectChange (index){
            this.selectData = index;
        }, //勾选用户变化
        modalQyQy (index){
            var vm = this;
            if (vm.selectData.length == 1){
                if(vm.selectData[0].status == '冻结'){
                    alert('该账户已被冻结')
                }else{
                    if(vm.selectData[0].status == '正常'){
                        vm.selectData[0].status = 0;
                    }else{
                        vm.selectData[0].status = 1;
                    }
                    let arr = {
                        id: vm.selectData[0].id,
                        status: vm.selectData[0].status
                    }
                    httpConfig.post('/user/changeStatus',arr,function(data){
                        vm.getUserList();
                        vm.modalQy = false;
                    })
                    // api
                    //     .users_changeStatus(arr)
                    //     .then(data => {
                    //         if (data.message == '运行正确'){
                    //             this.getUserList;
                    //         }
                    //     })
                }
            }else{
                alert('请勾选且仅勾选一个用户')
            }
        }, //启用/停用用户
        modalJdJd (index){
            var vm = this;
            if (vm.selectData.length == 1){
                if(vm.selectData[0].status == '停用'){
                    alert('该账户已被停用')
                }else{
                    if(vm.selectData[0].status == '正常'){
                        vm.selectData[0].status = 0;
                    }else{
                        vm.selectData[0].status = 2;
                    }
                    let arr = {
                        id: vm.selectData[0].id,
                        status: vm.selectData[0].status
                    }
                    httpConfig.post('/user/frozen',arr,function(data){
                        vm.getUserList();
                        vm.modalJd = false;
                    })
                }
            }else{
                alert('请勾选且仅勾选一个用户')
            }
        }, //解冻/冻结用户
        modalCzCz (index){
            var vm = this;
            if (vm.selectData.length == 1){
                let arr = {
                    id: vm.selectData[0].id,
                }
                httpConfig.post('/user/pwdReset',arr,function(data){
                    vm.getUserList();
                    vm.modalCz = false;
                })
            }else{
                alert('请勾选且仅勾选一个用户')
            }
        }, //重置密码
        changePage(index){
            this.showLists = [];
            var start = (index - 1) * this.pageSize;
            var end = index * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
            this.nowPage = index;
        }, //换页
        changeData(index){
            var vm = this;
            let arr = {id: index.id};
            httpConfig.post('/user/view',arr,function(data){
                vm.nowData = data.result.user;
                if(vm.nowData.gender == 1){
                    vm.nowData.gender = '男';
                }else{
                    vm.nowData.gender = '女';
                }
                if(vm.nowData.status == 0){
                    vm.nowData.status = '正常';
                }else if (vm.nowData.status == 1){
                    vm.nowData.status = '停用';
                }else{
                    vm.nowData.status = '冻结';
                }
                vm.nowOrgList = data.result.orgList;
                vm.nowRoleList = data.result.roleList;

                vm.modalXgData.id = data.result.user.id==undefined? null : data.result.user.id;
                vm.modalXgData.empno = data.result.user.empno==undefined? null : data.result.user.empno;
                vm.modalXgData.name = data.result.user.name==undefined? null : data.result.user.name;
                vm.modalXgData.job = data.result.user.job==undefined? null : data.result.user.job;
                vm.modalXgData.birthday = data.result.user.birthday==undefined? null : data.result.user.birthday;
                vm.modalXgData.gender = data.result.user.gender==undefined? null : data.result.user.gender;
                vm.modalXgData.email = data.result.user.email==undefined? null : data.result.user.email;
                vm.modalXgData.mobile = data.result.user.mobile==undefined? null : data.result.user.mobile;
                vm.modalXgData.qq = data.result.user.qq==undefined? null : data.result.user.qq;
                vm.modalXgData.numSametimeOnline = data.result.user.numSametimeOnline==undefined? null : data.result.user.numSametimeOnline;
                vm.modalXgData.remark = data.result.user.remark==undefined? null : data.result.user.remark;
                if(vm.modalXgData.gender == 1){
                    vm.modalXgData.gender = '男';
                }else{
                    vm.modalXgData.gender = '女';
                }
                vm.modalXgTemp = {
                    empno: vm.modalXgData.empno,
                    name: vm.modalXgData.name,
                    job: vm.modalXgData.job,
                    birthday: vm.modalXgData.birthday,
                    gender: vm.modalXgData.gender,
                    email: vm.modalXgData.email,
                    mobile: vm.modalXgData.mobile,
                    qq: vm.modalXgData.qq,
                    numSametimeOnline: vm.modalXgData.numSametimeOnline,
                    remark: vm.modalXgData.remark
                };
                vm.modalXgDateTemp = vm.modalXgTemp.birthday;
            })
        }, //选择用户数据
        modalCxCz(){
            this.modalCxData.empno = '';
            this.modalCxData.name = '';
        }, //用于查询模态框重置输入值
        modalCxCx(){
            let arr = {
                name: this.modalCxData.name,
                empno: this.modalCxData.empno
            }
            var vm = this;
            httpConfig.post('/user/listByUser',arr,function(data){
                vm.totalLists = data.result;
                vm.changePage(1);
                vm.totalLists.forEach(items => {
                    if (items.status == 0){
                        items.status = "正常";
                    }else{
                        items.status = "停用";
                    }
                });
            })
            this.modalCx = false;
        }, //查询模态框查询按钮功能
        modalXzClick(){
            var vm = this;
            let arr = {};
            httpConfig.post('/org/listAllName',arr,function(data){
                vm.parentOrg = data.result;
                vm.parentOrg.forEach(items => {
                    items.orgNameWithSpace = items.orgName;
                    for(var i = 0;i < items.levalId - 1;i ++){
                        items.orgNameWithSpace = '&nbsp;&nbsp;&nbsp;&nbsp;' + items.orgNameWithSpace;
                    }
                });
                vm.modalXz = true;
            })
        }, //新增按钮
        modalXzCz(name){
            this.$refs[name].resetFields();
        }, //新增模态框的重置按钮
        modalXzXz(name){
            var vm = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let arr = vm.modalXzData;
                    httpConfig.post('/user/empnoIsEmpty',arr,function(data){
                        httpConfig.post('/user/emailIsEmpty',arr,function(data){
                            if(arr.gender == '男'){
                                arr.gender = 1
                            }else{
                                arr.gender = 2
                            }
                            httpConfig.postJson('/user/add',arr,function(data){
                                vm.getUserList();
                                vm.modalXz = false;
                                vm.$Message.success('Success!');
                            })
                        })
                    })
                } else {
                    vm.$Message.error('Fail!');
                }
            })
            // let arr = vm.modalXzData;
            // httpConfig.post('/user/empnoIsEmpty',arr,function(data){
            //     if(data.result == 1){
            //         alert('该工号已存在');
            //     }else{
            //         httpConfig.post('/user/emailIsEmpty',arr,function(data){
            //             if(data.result == 1){
            //                 alert('该邮箱已存在')
            //             }else{
            //                 if(arr.gender == '男'){
            //                     arr.gender = 1
            //                 }else{
            //                     arr.gender = 2
            //                 }
            //                 httpConfig.postJson('/user/add',arr,function(data){
            //                     vm.getUserList();
            //                     vm.modalXz = false;
            //                 })
            //             }
            //         })
            //     }
            // })
        }, //新增模态框的新增按钮
        modalRoleClick(){
            var vm = this;
            let arr = {
                // roleId: [],
                userId: vm.nowData.id
            };
            // vm.nowRoleList.forEach(items => {
            //     arr.roleId.push(items.id)
            // });
            // arr.roleId = JSON.stringify(arr.roleId);
            httpConfig.post('/user/listNoRole',arr,function(data){
                vm.glRoleLists = data.result;
            })
            vm.modalRole = true;
        }, //添加关联角色按钮单击事件
        modalOrgClick(){
            var vm = this;
            let arr = {
                userId: vm.nowData.id
            };
            httpConfig.post('/user/listNoOrg',arr,function(data){
                var tmp = data.result;
                tmp = JSON.parse(JSON.stringify(tmp).replace(/orgName/g,"title"));
                var tmplv1 = [];
                var tmplv2 = [];
                var tmplv3 = [];
                tmp.forEach(items => {
                    items.children = [];
                    items.expand = true;
                    if(items.levalId == 2){
                        tmplv2.push(items);
                    }else if(items.levalId == 3){
                        tmplv3.push(items);
                    }else{
                        tmplv1.push(items);
                    }
                })
                var temp = [];
                var temp2 = [];
                var temp3 = [];
                tmplv3.forEach(items3 => {
                    var flag = 0;
                    tmplv2.forEach(items2 => {
                        if(items3.superiorId == items2.id){
                            items2.children.push(items3);
                            flag = 1;
                            return false;
                        }
                    })
                    if(flag == 0){
                        temp3.push(items3);
                    }
                })
                tmplv2.forEach(items2 => {
                    var flag = 0;
                    tmplv1.forEach(items1 => {
                        if(items2.superiorId == items1.id){
                            items1.children.push(items2);
                            flag = 1;
                            return false;
                        }
                    })
                    if(flag == 0){
                        temp2.push(items2);
                    }
                })
                tmplv1.forEach(items => {
                    temp.push(items);
                })
                temp2.forEach(items => {
                    temp.push(items);
                })
                temp3.forEach(items => {
                    temp.push(items);
                })
                vm.glOrgList = temp;
            })
            vm.modalOrg = true;
        }, //添加关联机构按钮单击事件
        glOrgDelete(index){
            var vm = this;
            vm.tempForDelete = index;
            vm.modalGlOrgDelete = true;
        }, //关联机构删除单击
        modalGlOrgDeleteDelete(){
            var vm = this;
            let arr = {
                orgId: vm.nowOrgList[vm.tempForDelete].id,
                userId: vm.nowData.id,
            }
            httpConfig.post('/user/deleteOrg',arr,function(){
                let arr2 = {
                    id: vm.nowData.id
                }
                httpConfig.post('/user/view',arr2,function(data){
                    vm.nowOrgList = data.result.orgList;
                })
                vm.modalGlOrgDelete = false;
            })
        }, //关联机构模态框删除事件
        glRoleDelete(index){
            var vm = this;
            vm.tempForDelete = index;
            vm.modalGlRoleDelete = true;
        }, //关联角色删除单击
        modalGlRoleDeleteDelete(){
            var vm = this;
            let arr = {
                roleId: vm.nowRoleList[vm.tempForDelete].id,
                userId: vm.nowData.id,
            }
            httpConfig.post('/user/deleteRole',arr,function(){
                let arr2 = {
                    id: vm.nowData.id
                }
                httpConfig.post('/user/view',arr2,function(data){
                    vm.nowRoleList = data.result.roleList;
                })
                vm.modalGlRoleDelete = false;
            })
        }, //关联角色模态框删除事件
        changeGlRole(index){
            var vm = this;
            vm.changeGlRoleData = index;
        }, //添加关联角色变化
        addRole(){
            var vm = this;
            let arr = {
                id: vm.nowData.id,
                roleList: []
            }
            vm.changeGlRoleData.forEach(items => {
                arr.roleList.push(items.id)
            });
            // arr.roleIds = JSON.stringify(arr.roleIds);
            httpConfig.postJson('/user/addRole',arr,function(){
                let arr2 = {
                    id: vm.nowData.id
                }
                httpConfig.post('/user/view',arr2,function(data){
                    vm.nowRoleList = data.result.roleList;
                })
                vm.modalRole = false;
                vm.$Message.success('Success!');
            })
        }, //添加关联角色
        changeGlOrg(index){
            var vm = this;
            vm.changeGlOrgData = index;
        }, //添加关联机构变化
        addOrg(){
            var vm = this;
            let arr = {
                id: vm.nowData.id,
                orgList: []
            }
            vm.changeGlOrgData.forEach(items => {
                arr.orgList.push(items.id)
            });
            // arr.orgIds = JSON.stringify(arr.orgIds);
            httpConfig.postJson('/user/addOrg',arr,function(){
                let arr2 = {
                    id: vm.nowData.id
                }
                httpConfig.post('/user/view',arr2,function(data){
                    vm.nowOrgList = data.result.orgList;
                })
                vm.modalOrg = false;
                vm.$Message.success('Success!');
            })
        }, //添加关联机构
    },
    computed: {
        dataCount(){
            return this.totalLists.length;
        },
    },
    watch: {
        totalLists(){
            var start = (this.nowPage - 1) * this.pageSize;
            var end = this.nowPage * this.pageSize;
            this.showLists = this.totalLists.slice(start,end);
        },
        'modalXzData.orgList'(){
            var vm = this;
            let arr =  {
                orgList: vm.modalXzData.orgList
            };
            httpConfig.postJson('/role/listByOrgList',arr,function(data){
                vm.parentRole = data.result;
            })
        },
    }
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
    .message-box{
        width: 100%;
        /* margin: 16px 0; */
        padding: 15px 10px;
        overflow: hidden;
        border-bottom: 1px dashed #f2f2f2;
    }
    .message-box-container{
        width: 100%;
    }
    .message-box-container div{
        width: 50%;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>