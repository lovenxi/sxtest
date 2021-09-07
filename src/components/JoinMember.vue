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
      <span slot="action" slot-scope="text, record">
        <a @click="() => SetBindInfo1(record)">升级</a>
        <a-divider type="vertical" />
        <a @click="() => SetBindInfo2(record)">降级</a>
      </span>
    </a-table>
    <a-modal
      title="绑定党支部"
      :visible="party_visible1"
      :confirm-loading="party_confirmLoading1"
      @ok="Up"
      @cancel="ShowPartyDialog1"
    >
      <a-input
        class="dialog"
        v-model="bindPartyID1"
        placeholder="党支部ID"
      ></a-input>
    </a-modal>
    <a-modal
      title="绑定党支部"
      :visible="party_visible2"
      :confirm-loading="party_confirmLoading2"
      @ok="Down"
      @cancel="ShowPartyDialog2"
    >
      <a-input
        class="dialog"
        v-model="bindPartyID2"
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
    title: "所属党支部",
    dataIndex: "party_name",
    scopedSlots: { customRender: "party_name" },
  },
  {
    title: "加入时间",
    dataIndex: "join_time",
    scopedSlots: { customRender: "join_time" },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  beforeMount() {
    this.Refresh();
  },
  data() {
    return {
      tableContent: [],
      columns,

      party_visible1: false,
      party_confirmLoading1: false,
      bindPartyID1: "",
      bindMemberID1: "",

      party_visible2: false,
      party_confirmLoading2: false,
      bindPartyID2: "",
      bindMemberID2: "",
    };
  },
  methods: {
    Refresh() {
      this.$http.post("/ListPartyMember").then((res) => {
        if (res.data.code == 0) {
          if (res.data.result == null) {
            return
          }
          res.data.result.forEach((item) => {
            item.join_time = new Date(parseInt(item.join_time) * 1000).toLocaleString().match(/[0-9]*\/[0-9]*\/[0-9]*/);
          });
          this.tableContent = res.data.result;
        }
      });
    },
    Up() {
      this.$http.post("/TransformNextMemberType", {
        member_id: parseInt(this.bindMemberID1),
        party_id: parseInt(this.bindPartyID1),
      }).then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("升级成功");
            this.Refresh();
            this.ClosePartyDialog1();
          } else {
            this.$message.error("升级失败: " + String(res.data.error.msg));
          }
      })
    },
    Down() {
      this.$http.post("/TransformLastMemberType", {
        member_id: parseInt(this.bindMemberID2),
        party_id: parseInt(this.bindPartyID2),
      }).then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("降级成功");
            this.Refresh();
            this.ClosePartyDialog2();
          } else {
            this.$message.error("降级失败: " + String(res.data.error.msg));
          }
      })
    },
    SetBindInfo1(item) {
      this.bindMemberID1 = item.id;
      this.ShowPartyDialog1();
    },
    ShowPartyDialog1() {
      this.PartyClean1();
      this.party_visible1 = !this.party_visible1;
    },
    ClosePartyDialog1() {
      this.PartyClean1(); 
      this.party_visible1 = false;
    },
    PartyClean1() {
        this.bindPartyID1 = "";
    },

    SetBindInfo2(item) {
      this.bindMemberID2 = item.id;
      this.ShowPartyDialog2();
    },
    ShowPartyDialog2() {
      this.PartyClean2();
      this.party_visible2 = !this.party_visible2;
    },
    ClosePartyDialog2() {
      this.PartyClean2(); 
      this.party_visible2 = false;
    },
    PartyClean2() {
        this.bindPartyID2 = "";
    },
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
