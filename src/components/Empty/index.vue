<script setup>
import lottieDataNoData from "@/assets/lottie/no-data.json";
import IMG_EMPTY1 from "@/assets/status/403.svg?component";
import LottieCover from "@/components/Lottie/index.vue";
import { computed, onMounted } from "vue";
// interface Props {
//   emptySoure?: string | number;
//   type?: "img" | "lottie";
//   title?: string;
//   subTitle?: string;
//   height?: string;
//   width?: string;
// }
// const props = withDefaults(defineProps<Props>(), {
//   emptySoure: "default",
//   type: "lottie",
//   title: "暂无数据",
//   subTitle: "",
//   height: "12em",
//   width: "12em"
// });
const props = defineProps({
  emptySoure: { type: [String, Number], default: "default" },
  type: { type: String, default: "lottie" },
  title: { type: String, default: "暂无数据" },
  subTitle: { type: String, default: "" },
  height: { type: String, default: "12em" },
  width: { type: String, default: "12em" }
});
const img_source_enum = {
  default: IMG_EMPTY1
};
const lottie_source_enum = {
  default: lottieDataNoData
};

const showSoure = computed(() => {
  if (props.type == "img") {
    return img_source_enum[props.emptySoure] || IMG_EMPTY1;
  } else if (props.type == "lottie") {
    return lottie_source_enum[props.emptySoure] || lottieDataNoData;
  } else {
    return IMG_EMPTY1;
  }
});
onMounted(() => {});
</script>

<template>
  <div class="empty-content">
    <template v-if="type === 'img'">
      <img
        class="empty-img"
        :style="{
          height,
          width
        }"
        :src="showSoure"
      >
    </template>
    <template v-else-if="type === 'lottie'">
      <LottieCover :width :height :json-data="showSoure" />
    </template>
    <div class="empty-tip">
      <span class="title" v-html="title" />
      <span class="subtitle" v-html="subTitle" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .empty-img {
    flex-shrink: 0;
  }

  .empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;

    span {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: #b1bdc2;
      text-align: center;
    }
  }
}
</style>
