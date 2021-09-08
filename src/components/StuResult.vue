<template>
<div>
  <a-descriptions :title="act.content">
    <a-descriptions-item label="学习ID">
      {{ act.id }}
    </a-descriptions-item>
    <a-descriptions-item label="标题">
      {{ act.title }}
    </a-descriptions-item>
    <a-descriptions-item label="学习内容">
      {{ act.content }}
    </a-descriptions-item>
    <a-descriptions-item label="开始时间">
      {{ act.start_time[0] }}
    </a-descriptions-item>
    <a-descriptions-item label="结束时间">
      {{ act.end_time[0] }}
    </a-descriptions-item>
  </a-descriptions>
  <a-divider></a-divider>
  <a-table :columns="columns" :data-source="tableContent">
      <span slot="name" slot-scope="text">{{ text }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record)">移除</a>
        <a-divider type="vertical" />
        <a @click="() => AddPoint(record)">修改分数</a>
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
    <a-modal
      title="绑定党支部"
      :visible="study_visible"
      :confirm-loading="study_confirmLoading"
      @ok="UpdatePoint"
      @cancel="ShowStudyDialog"
    >
      <a-input
        class="dialog"
        v-model="Score"
        placeholder="得分"
      ></a-input>
    </a-modal>
</div>
</template>

<script>
const columns = [
  {
    title: "成员ID",
    dataIndex: "member_id",
    scopedSlots: { customRender: "member_id" },
  },
  {
    title: "成员名称",
    dataIndex: "member_name",
    scopedSlots: { customRender: "member_name" },
  },
  {
    title: "是否完成",
    dataIndex: "is_finish",
    scopedSlots: { customRender: "is_finish" },
  },
  {
    title: "得分",
    dataIndex: "score",
    scopedSlots: { customRender: "score" },
  },
  {
    title: "完成时间",
    dataIndex: "finish_time",
    scopedSlots: { customRender: "finish_time" },
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

      Score:"",

      activity: this.act,

      study_visible: false,
      study_confirmLoading: false,

      newMemberID: "",
      newMemBerID1:"",
    }
  },
  methods: {
    Delete(item) {
      this.$http.post("/RemoveMemberFromStudy", {
        study_id: parseInt(this.activity.id),
        member_id: parseInt(item.member_id),
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
      this.$http.post("/AddMemberToStudy", {
        study_id: parseInt(this.activity.id),
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

    AddPoint(item) {
      this.newMemBerID1 = item.member_id;
      this.Score = item.score;
      this.ShowStudyDialog();
    },

    ShowDialog() {
      this.newMemberID = "";
      this.visible = !this.visible;
    },

    UpdatePoint() {
      let param = {
        member_id: parseInt(this.newMemBerID1),
        study_id: parseInt(this.activity.id),
        score: parseInt(this.Score),
      };
      this.$http.post("/AddMemberScore",param).then((res) => {
        if (parseInt(res.data.code) === 0) {
          this.$message.success("添加成功");
          this.Refresh();
          this.ShowStudyDialog();
        } else {
          this.$message.error("添加失败: " + String(res.data.error.msg));
        }
      })
    },

    ShowStudyDialog() {
      this.StudyClean();
      this.study_visible = !this.study_visible;
    },
    StudyClean() {
        this.Score = "";
    },
    Refresh() {
      this.$http.post("/GetStudyResult", {
        id: parseInt(this.activity.id),
      }).then((res) => {
        if (res.data.code == 0) {
          res.data.result.forEach((item) => {
            item.finish_time = new Date(parseInt(item.finish_time) * 1000).toLocaleString().match(/[0-9]*\/[0-9]*\/[0-9]*/);
            item.is_finish = item.is_finish ? "是" : "否";
          })
          this.tableContent = res.data.result;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>