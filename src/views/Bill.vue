<template>
  <div>
    <!-- <a-input-search
      placeholder="input search text"
      style="width: 200px"
      @search="onSearch"
    /> -->
    <!-- <a-divider /> -->
    <a-statistic title="现有余额" v-model="NowBalance"  />
    <a-divider />
    <a-table :columns="columns" :data-source="tableContent">
      <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
      <span slot="action" slot-scope="text, record">
        <a @click="() => Rollback(record)">回滚</a>
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
      <!-- <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => Edit(record.key)">Edit</a>
          </span>
        </div>
      </template> -->
    </a-table>
    <a-button type="primary" @click="ShowDialog"> 添加 </a-button>
    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="Insert"
      @cancel="ShowDialog"
    >
      <a-input
        class="dialog"
        v-model="newMemID"
        placeholder="成员ID"
      ></a-input>      
      <a-input
        class="dialog"
        v-model="newContent"
        placeholder="内容"
      ></a-input>
      <a-row>
      <a-col :span="12">
        <a-slider v-model="newCost" :min="-100" :max="100" />
      </a-col>
      <a-col :span="4">
        <a-input-number v-model="newCost" :min="-100" :max="100" style="marginLeft: 16px" />
      </a-col>
    </a-row>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "账单ID",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
  },
  {
    title: "成员ID",
    dataIndex: "member_id",
    scopedSlots: { customRender: "member_id" },
  },
  {
    title: "内容",
    dataIndex: "content",
    scopedSlots: { customRender: "content" },
  },
  {
    title: "花费",
    dataIndex: "cost",
    scopedSlots: { customRender: "cost" },
  },
  {
    title: "处理时间",
    dataIndex: "deal_time",
    scopedSlots: { customRender: "deal_time" },
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

      inputValue: 0,
     // inputValue1: 1,

      visible: false,
      confirmLoading: false,

      newMemID: "",
      newContent: "",
      newCost: "",
      NowBalance:""
    };
  },
  methods: {
    Rollback(item) {
      this.$http
        .post("/RollbackBill", {
            id: parseInt(item.id)
          })
        .then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("回滚成功");
            this.Refresh();
          } else {
            this.$message.error("回滚失败: " + String(res.data.error.msg));
          }
        });
    },
    /*Edit(item) {
      this.$http
        .post("/UpdateActivity", {
          id: parseInt(item.id),
          party_id: parseInt(item.party_id),
          content: item.content,
          start_time: item.start_time,
          end_time: item.end_time,
        })
        .then((res) => {
          if (parseInt(res.data.code) === 0) {
            this.$message.success("修改成功");
            this.Refresh();
          } else {
            this.$message.error("修改失败: " + String(res.data.error.msg));
          }
        });
    },*/
    Refresh() {
      this.$http.post("/ListBill").then((res) => {
        if (res.data.code == 0) {
          this.tableContent = res.data.result;
        }
      });
      this.$http.post("/GetNowBalance").then((res) =>{
        console.log(res);
        if (res.data.code == 0) {
          this.NowBalance = res.data.result.balance;
        }
      })
    },
    ShowDialog() {
      this.Clean();
      this.visible = !this.visible;
    },
    Insert() {
      this.$http
        .post("/CreateBill", {
          member_id: parseInt(this.newMemID),
          content: this.newContent,
          cost: parseInt(this.newCost)
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
        this.newMemID = "";
        this.newContent = "";
        this.newCost = ""
    },
   /* onSearch(value) {
      console.log("type=resv" + "&custId=" + value)
      this.$http
        .post("/search", "type=resv" + "&custID=" + value)
        .then((res) => {
          this.tableContent = res.data;
        });
    },*/
    onTimePick(date, dateString) {
      this.newStartTime = parseInt(Date.parse(date[0])) / 1000;
      this.newEndTime = parseInt(Date.parse(date[1])) / 1000;
      console.log(this.newStartTime, this.newEndTime);
    }
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
