<template>
  <svg
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <title :id="iconName" lang="nl">{{ iconName }} icon</title>
    <g fill="none" fill-rule="evenodd">
      <text
        fill="#9B9B9B"
        font-family="FiraCode-Regular, Fira Code"
        font-size="432"
      >
        <tspan x="33" y="373">m</tspan>
      </text>
      <text
        fill="#696969"
        font-family="FiraCode-Regular, Fira Code"
        font-size="288"
      >
        <tspan x="263.882" y="424">1</tspan>
      </text>
      <path
        stroke="#4A4A4A"
        stroke-linecap="square"
        stroke-width="25"
        d="M452 40v432"
      >
        <animate
          :values="`#4A4A4A;rgba(0,0,0,0);rgba(0,0,0,0);#4A4A4A;`"
          attributeType="XML"
          attributeName="stroke"
          dur="1s"
          repeatCount="10"
        ></animate>
      </path>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'logo',
    },
    width: {
      type: [Number, String],
      default: 36,
    },
    height: {
      type: [Number, String],
      default: 36,
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },
}
</script>

<style>
.m1-logo-element {
  user-select: none;
}
</style>
