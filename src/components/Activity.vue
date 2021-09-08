<template>
<div>
  <a-descriptions :title="activity.content">
    <a-descriptions-item label="活动ID">
      {{ activity.id }}
    </a-descriptions-item>
    <a-descriptions-item label="所属党支部">
      {{ activity.party_id }}
    </a-descriptions-item>
    <a-descriptions-item label="开始时间">
      {{ activity.start_time[0] }}
    </a-descriptions-item>
    <a-descriptions-item label="结束时间">
      {{ activity.end_time[0] }}
    </a-descriptions-item>
  </a-descriptions>
  <a-divider></a-divider>
  <a-table :columns="columns" :data-source="tableContent">
      <span slot="name" slot-scope="text">{{ text }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record)">移除</a>
      </span>
    </a-table>
    <a-button type="primary" @click="ShowDialog"> 添加 </a-button>
    <a-modal
      title="添加成员"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="Add"
      @cancel="ShowDialog"
    >
      <a-input
        class="dialog"
        v-model="newMemberID"
        placeholder="成员ID"
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  beforeMount() {
    this.Refresh();
  },
  props: ['act'],
  data: function() {
    return {
      tableContent: [],
      columns,

      visible: false,
      confirmLoading: false,

      activity: this.act,

      newMemberID: "",
    }
  },
  methods: {
    Delete(item) {
      this.$http.post("/RemoveMembersToActivity", {
        id: parseInt(this.activity.id),
        member_id: parseInt(item.id),
      }).then((res) => {
        if (parseInt(res.data.code) === 0) {
          this.$message.success("移除成功");
          this.Refresh();
        } else {
          this.$message.error("移除失败: " + String(res.data.error.msg));
        }
      })
    },
    Add() {
      this.$http.post("/AddMembersToActivity", {
        id: parseInt(this.activity.id),
        member_id: parseInt(this.newMemberID),
      }).then((res) => {
        if (parseInt(res.data.code) === 0) {
          this.$message.success("添加成功");
          this.Refresh();
          this.ShowDialog();
        } else {
          this.$message.error("添加失败: " + String(res.data.error.msg));
        }
      })
    },
    Clean() {
      this.newMemberID = "";
    },
    ShowDialog() {
      this.newMemberID = "";
      this.visible = !this.visible;
    },
    Refresh() {
      this.$http.post("/ListActivityMember", {
        id: parseInt(this.activity.id),
      }).then((res) => {
        if (res.data.code == 0) {
          this.tableContent = res.data.result;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>