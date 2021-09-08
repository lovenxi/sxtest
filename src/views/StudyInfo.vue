<template>
<div>
  <div v-if="!detailShow">
    <a-table :columns="columns" :data-source="tableContent">
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record)">删除</a>
        <a-divider type="vertical" />
        <a @click="() => ShowDetail(record)">详情</a>
      </span>
      <template
        v-for="col in ['region', 'email','memtotal']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
    </a-table>
    <a-button type="primary" @click="ShowDialog"> 添加 </a-button>
    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="Insert"
      @cancel="ShowDialog"
    >
      <a-range-picker @change="onTimePick" />
      <a-input
        class="dialog"
        v-model="newTitle"
        placeholder="标题"
      ></a-input>      
      <a-input
        class="dialog"
        v-model="newContent"
        placeholder="学习内容"
      ></a-input>
    </a-modal>
  </div>
  <div v-else>
    <a-button @click="HideDetail"> 返回 </a-button>
    <a-divider></a-divider>
    <stu-result :act="showAct"></stu-result>
  </div>
</div>
</template>
<script>
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
  },
  {
    title: "标题",
    dataIndex: "title",
    scopedSlots: { customRender: "title" },
  },
  {
    title: "学习内容",
    dataIndex: "content",
    scopedSlots: { customRender: "content" },
  },
  {
    title: "开始时间",
    dataIndex: "start_time",
    scopedSlots: { customRender: "start_time" },
  },
  {
    title: "结束时间",
    dataIndex: "end_time",
    scopedSlots: { customRender: "end_time" },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

import StuResult from "../components/StuResult.vue";

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

      detailShow: false,
      showAct: "",

      newTitle:"",
      newContent: "",
      newStartTime: "",
      newEndTime: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("/DeleteStudy", {
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
      this.$http.post("/ListStudy").then((res) => {
        if (res.data.code == 0) {
          res.data.result.forEach((item) => {
            item.start_time = new Date(parseInt(item.start_time) * 1000).toLocaleString().match(/[0-9]*\/[0-9]*\/[0-9]*/);
            item.end_time = new Date(parseInt(item.end_time) * 1000).toLocaleString().match(/[0-9]*\/[0-9]*\/[0-9]*/);
          })
          this.tableContent = res.data.result;
        }
      });
    },
    ShowDialog() {
      this.Clean();
      this.visible = !this.visible;
    },
    Insert() {
      this.$http
        .post("/CreateStudy", {
          title: this.newTitle,
          content: this.newContent,
          start_time: this.newStartTime,
          end_time: this.newEndTime
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
        this.newTitle = "";
        this.newContent = "";
        this.newStartTime = "";
        this.newEndTime = "";
    },
    ShowDetail(item) {
      this.showAct = item;
      this.detailShow = true;
    },
    HideDetail() {
      this.detailShow = false;
    },
    onTimePick(date, dateString) {
      this.newStartTime = parseInt(Date.parse(date[0])) / 1000;
      this.newEndTime = parseInt(Date.parse(date[1])) / 1000;
      console.log(this.newStartTime, this.newEndTime);
    }
  },
  components: {
    StuResult,
  }
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
