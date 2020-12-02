<template>
  <div>
    <a-table :columns="columns" :data-source="tableContent">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record.location)">Delete</a>
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
        v-model="newlocation"
        placeholder="Location"
      ></a-input>
      <a-input class="dialog" v-model="newprice" placeholder="Price"></a-input>
      <a-input
        class="dialog"
        v-model="newnumBus"
        placeholder="NumBus"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newnumAvail"
        placeholder="NumAvail"
      ></a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "NumBus",
    dataIndex: "numBus",
    key: "numBus",
    ellipsis: true,
  },
  {
    title: "NumAvail",
    dataIndex: "numAvail",
    key: "numAvail",
    ellipsis: true,
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
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

      newlocation: "",
      newprice: "",
      newnumBus: "",
      newnumAvail: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("/delete", "type=bus&location=" + item)
        .then((res) => {
          this.Refresh();
        });
    },
    Refresh() {
      this.$http
        .post("/search", "type=bus")
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
          "type=bus&location=" +
            this.newlocation +
            "&price=" +
            this.newprice +
            "&numBus=" +
            this.newnumBus +
            "&numAvail=" +
            this.newnumAvail
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
      this.newlocation = "",
      this.newprice = "",
      this.newnumBus = "",
      this.newnumAvail = ""
    }
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
