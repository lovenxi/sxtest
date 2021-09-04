<template>
  <div>
    <a-table :columns="columns" :data-source="tableContent">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record.custID)">Delete</a>
      </span>
    </a-table>
    <a-button type="primary" @click="ShowDialog">
      添加
    </a-button>
    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="Insert"
      @cancel="ShowDialog"
    >
      <a-input
        class="dialog"
        v-model="newcustID"
        placeholder="Name"
      ></a-input>
      <a-input class="dialog" v-model="newcustName" placeholder="CustName"></a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
    scopedSlots: { customRender: "email" },
  },
  {
    title: "IDcard",
    key: "idcard",
    scopedSlots: { customRender: "email" },
  },
  {
    title: "Memtype",
    key: "memtype",
    scopedSlots: { customRender: "memtype" },
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

      newcustID: "",
      newcustName: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("/delete", "type=customer&custID=" + item)
        .then((res) => {
          this.Refresh();
        });
    },
    Refresh() {
      this.$http
        .post("/search", "type=customer")
        .then((res) => {
          this.tableContent = res.data;
        });
    },
    ShowDialog() {
      this.Clean();
      this.visible = !this.visible;
    },
    Insert() {
      this.$http
        .post(
          "/insert",
          "type=customer&custID=" +
            this.newcustID +
            "&custName=" + this.newcustName
        )
        .then((res) => {
          if (res.data == "1") {
            this.$message.success('添加成功');
            this.Refresh();
            this.ShowDialog();
          } else {
            this.$message.error('添加失败');
            this.Clean();
          }
        });
    },
    Clean() {
        this.newcustID = "";
        this.newcustName = "";
    }
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
