<template>
  <a-tabs default-active-key="2">
    <a-tab-pane key="1">
      <span slot="tab">
        飞机
      </span>
      <flight/>
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab">
        旅馆
      </span>
      <hotel></hotel>
    </a-tab-pane>
    <a-tab-pane key="3">
      <span slot="tab">
        大巴车
      </span>
      <bus></bus>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Bus from '../components/Bus.vue';
import Flight from '../components/Flight.vue';
import Hotel from '../components/Hotel.vue';

export default {
    components: {
        Flight,
        Hotel,
        Bus}
};
</script>

<style scoped></style>
