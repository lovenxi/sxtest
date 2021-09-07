<template>
  <div>
    <!-- <a-input-search
      placeholder="input search text"
      style="width: 200px"
      @search="onSearch"
    /> -->
    <!-- <a-divider /> -->
    <a-table :columns="columns" :data-source="tableContent">
      <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record)">删除</a>
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
        v-model="newName"
        placeholder="党支部名称"
      ></a-input>      
      <a-input
        class="dialog"
        v-model="newRegion"
        placeholder="党支部地址"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newEmail"
        placeholder="党支部Email"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newMemTotal"
        placeholder="党支部总人数"
      ></a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "党支部ID",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
  },
  {
    title: "党支部名称",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "党支部地址",
    dataIndex: "region",
    scopedSlots: { customRender: "region" },
  },
  {
    title: "党支部Email",
    dataIndex: "email",
    scopedSlots: { customRender: "email" },
  },
  {
    title: "党支部总人数",
    dataIndex: "member_total",
    scopedSlots: { customRender: "member_total" },
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

      visible: false,
      confirmLoading: false,

      newName: "",
      newRegion: "",
      newEmail: "",
      newMemTotal: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("/DeletePartyInfo", {
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
      this.$http.post("/ListPartyInfo").then((res) => {
        if (res.data.code == 0) {
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
        .post("/CreatePartyInfo", {
          name: this.newName,
          region: this.newRegion,
          email: this.newEmail,
          member_total: parseInt(this.newMemTotal)
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
        this.newRegion = "";
        this.newEmail = "";
        this.newMemTotal = "";
    },
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
