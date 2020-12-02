<template>
  <div>
    <a-table :columns="columns" :data-source="tableContent">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <a @click="() => Delete(record.flightNum)">Delete</a>
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
        v-model="newflightNum"
        placeholder="FlightNum"
      ></a-input>
      <a-input class="dialog" v-model="newprice" placeholder="Price"></a-input>
      <a-input
        class="dialog"
        v-model="newnumSeats"
        placeholder="NumSeats"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newnumAvail"
        placeholder="NumAvail"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newfromCity"
        placeholder="FromCity"
      ></a-input>
      <a-input
        class="dialog"
        v-model="newarivCity"
        placeholder="AirvCity"
      ></a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "FlightNum",
    dataIndex: "flightNum",
    key: "flightNum",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "NumSeats",
    dataIndex: "numSeats",
    key: "numSeats",
    ellipsis: true,
  },
  {
    title: "NumAvail",
    dataIndex: "numAvail",
    key: "numAvail",
    ellipsis: true,
  },
  {
    title: "From City",
    dataIndex: "fromCity",
    key: "fromCity",
    ellipsis: true,
  },
  {
    title: "ArivCity",
    dataIndex: "arivCity",
    key: "arivCity",
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

      newflightNum: "",
      newprice: "",
      newnumSeats: "",
      newnumAvail: "",
      newfromCity: "",
      newarivCity: "",
    };
  },
  methods: {
    Delete(item) {
      this.$http
        .post("http://127.0.0.1:8080/delete", "type=flight&flightNum=" + item)
        .then((res) => {
          this.Refresh();
        });
    },
    Refresh() {
      this.$http
        .post("http://127.0.0.1:8080/search", "type=flight")
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
          "http://127.0.0.1:8080/insert",
          "type=flight&flightNum=" +
            this.newflightNum +
            "&price=" +
            this.newprice +
            "&numSeats=" +
            this.newnumSeats +
            "&numAvail=" +
            this.newnumAvail +
            "&fromCity=" +
            this.newfromCity +
            "&arivCity=" +
            this.newarivCity
        )
        .then((res) => {
          if (res.data == "1") {
            this.$message.success("添加成功");
            this.Refresh();
            this.ShowDialog();
          } else {
            this.$message.error("添加失败");
            this.Clean();
          }
        });
    },
    Clean() {
      this.newflightNum = "",
      this.newprice = "",
      this.newnumSeats = "",
      this.newnumAvail = "",
      this.newfromCity = "",
      this.newarivCity = ""
    }
  },
};
</script>

<style scoped>
a-modal a-input {
  padding-bottom: 10px;
}
</style>
