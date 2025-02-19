<script setup>
import { isUrl } from "@pureadmin/utils";
import { computed } from "vue";

// const props = defineProps<{
//   to: menuType;
// }>();
const props = defineProps({
  to: {
    name: String
  }
});

const isExternalLink = computed(() => isUrl(props.to.name));
const getLinkProps = item => {
  if (isExternalLink.value) {
    return {
      href: item.name,
      target: "_blank",
      rel: "noopener"
    };
  }
  return {
    to: item
  };
};
</script>

<template>
  <component
    :is="isExternalLink ? 'a' : 'router-link'"
    v-bind="getLinkProps(to)"
  >
    <slot />
  </component>
</template>
