<template>
  <div>
    <a-table :columns="columns" :data-source="tableContent">
      <span slot="name" slot-scope="text">{{ text }}</span>
      <span slot="member_type" slot-scope="mtype">
        <a-tag
          :key="mtype"
          :color="getTypeColor(mtype)"
        >
          {{ showType(mtype).toUpperCase() }}
        </a-tag>
      </span>
      <span slot="change_type" slot-scope="text, record">
        <a @click="() => SetBindInfo(record, 0)">无</a>
        <a-divider type="vertical" />
        <a @click="() => SetBindInfo(record, 1)">入党积极分子</a>
        <a-divider type="vertical" />
        <a @click="() => SetBindInfo(record, 2)">预备党员</a>
        <a-divider type="vertical" />
        <a @click="() => SetBindInfo(record, 3)">党员</a>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record)">删除</a>
      </span>
    </a-table>
    <a-button type="primary" @click="ShowDialog"> 添加 </a-button>
    <a-modal
      title="添加成员"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="Insert"
      @cancel="ShowDialog"
    >
      <a-input
        class="dialog"
        v-model="newName"
        placeholder="姓名"
      ></a-input>      
      <a-input
        class="dialog"
        v-model="newIDCard"
        placeholder="身份证号"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newPhone"
        placeholder="电话"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newEmail"
        placeholder="邮箱"
      ></a-input>
      <a-select  
        placeholder="input search text"
        style="width: 100%"
        v-model="newMemberType"
      >
        <a-select-option value=0>
          无
        </a-select-option>
        <a-select-option value=1>
          入党积极分子
        </a-select-option>
        <a-select-option value=2>
          预备党员
        </a-select-option>
        <a-select-option value=3>
          党员
        </a-select-option>
      </a-select>
    </a-modal>
    <a-modal
      title="绑定党支部"
      :visible="party_visible"
      :confirm-loading="party_confirmLoading"
      @ok="changeMemberType"
      @cancel="ShowPartyDialog"
    >
      <a-input
        class="dialog"
        v-model="bindPartyID"
        placeholder="党支部ID"
      ></a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "成员ID",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
  },
  {
    title: "姓名",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "身份证号",
    dataIndex: "id_card",
    scopedSlots: { customRender: "id_card" },
  },
  {
    title: "电话",
    dataIndex: "phone",
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    scopedSlots: { customRender: "email" },
  },
  {
    title: "类型",
    dataIndex: "member_type",
    scopedSlots: { customRender: "member_type" },
  },
  {
    title: '任免',
    key: 'change_type',
    scopedSlots: { customRender: 'change_type' },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const mTypeString = [
  "无",
  "入党积极分子",
  "预备党员",
  "党员",
];
const mTypeColor = [
  "geekblue",
  "gold",
  "volcano",
  "red",
];
const requestRUL = [
  "/TransformUnknownMember",
  "/TransformOutMember",
  "/TransformPreJoinMember",
  "/TransformPartyMember",
];

export default {
  beforeMount() {
    this.Refresh();
  },
  data() {
    return {
      tableContent: [],
      columns,

      visible: false,
      confirmLoading: false,
      
      party_visible: false,
      party_confirmLoading: false,
      bindPartyID: "",
      bindMemberID: "",
      bindMType: "",

      newName: "",
      newPhone: "",
      newEmail: "",
      newIDCard: "",
      newMemberType: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("/DeleteMember", {
            id: parseInt(item.id)
          })
        .then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("删除成功");
            this.Refresh();
          } else {
            this.$message.error("删除失败: " + String(res.data.error.msg));
          }
        });
    },
    Refresh() {
      this.$http.post("/ListMember").then((res) => {
        if (res.data.code == 0) {
          this.tableContent = res.data.result;
        }
      });
    },
    ShowDialog() {
      this.Clean();
      this.visible = !this.visible;
    },
    SetBindInfo(item, mtype) {
      this.bindMemberID = item.id;
      this.bindMType = mtype;
      if (parseInt(mtype) < 2) {
        this.changeMemberType();
        return;
      }
      this.ShowPartyDialog();
    },
    ShowPartyDialog() {
      this.PartyClean();
      this.party_visible = !this.party_visible;
    },
    ClosePartyDialog() {
      this.PartyClean(); 
      this.party_visible = false;
    },
    Insert() {
      this.$http
        .post("/CreateMember", {
          name: this.newName,
          phone: this.newPhone,
          email: this.newEmail,
          id_card: this.newIDCard,
          member_type: parseInt(this.newMemberType),
        })
        .then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("添加成功");
            this.Refresh();
            this.ShowDialog();
          } else {
            this.$message.error("添加失败: " + String(res.data.error.msg));
            this.Clean();
          }
        });
    },
    Clean() {
        this.newName = "";
        this.newPhone = "";
        this.newEmail = "";
        this.newIDCard = "";
        this.newMemberType = "";
    },
    PartyClean() {
        this.bindPartyID = "";
    },
    onTimePick(date, dateString) {
      this.newStartTime = parseInt(Date.parse(date[0])) / 1000;
      this.newEndTime = parseInt(Date.parse(date[1])) / 1000;
      console.log(this.newStartTime, this.newEndTime);
    },
    showType(type) {
      return mTypeString[parseInt(type)];
    },
    getTypeColor(type) {
      return mTypeColor[parseInt(type)];
    },
    changeMemberType() {
      let mtype = parseInt(this.bindMType)
      let param;
      if (mtype < 2) {
        param = {
          id: parseInt(this.bindMemberID),
        }
      } else {
        param = {
          member_id: parseInt(this.bindMemberID),
          party_id: parseInt(this.bindPartyID),
        }
      }
      this.$http
        .post(requestRUL[mtype], param)
        .then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("任免" + this.showType(mtype) + "成功");
            this.Refresh();
            this.ClosePartyDialog();
          } else {
            this.$message.error("任免" + this.showType(mtype) + "失败: " + String(res.data.error.msg));
          }
        });
    }
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
