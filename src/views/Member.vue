<template>
  <a-tabs default-active-key="1" @change="refresh">
    <a-tab-pane key="1">
      <span slot="tab">
        在记录人员
      </span>
      <all-member :key="id"></all-member>
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab">
        入党积极分子
      </span>
      <out-member :key="id"></out-member>
    </a-tab-pane>
    <a-tab-pane key="3">
      <span slot="tab">
        预备党员
      </span>
      <pre-join-member :key="id"></pre-join-member>
    </a-tab-pane>
    <a-tab-pane key="4">
      <span slot="tab">
        党员
      </span>
      <join-member :key="id"></join-member>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import AllMember from '../components/AllMember.vue';
import OutMember from '../components/OutMember.vue';
import PreJoinMember from '../components/PreJoinMember.vue';
import JoinMember from '../components/JoinMember.vue';

export default {
  data() {
    return {
      id: 0,
    }
  },
  methods: {
    refresh() {
      this.id = this.id == 0 ? 1 : 0;
    }
  },
  components: {
    AllMember,
    OutMember,
    PreJoinMember,
    JoinMember,
  },
};
</script>

<style scoped></style>
