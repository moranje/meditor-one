<template>
  <svg
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 82 82"
    style="vertical-align: middle;"
  >
    <title :id="iconName" lang="nl">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <g transform="translate(-8 -16)">
        <text
          id="m1-logo-m"
          font-family="Fira Code"
          font-size="90"
          class="m1-logo-element"
        >
          <tspan y="75">
            m
          </tspan>
        </text>
        <text
          id="m1-logo-1"
          font-family="Fira Code"
          font-size="72"
          class="m1-logo-element"
        >
          <tspan x="48" y="94">
            1
          </tspan>
        </text>
        <path
          id="m1-logo-cursor"
          :style="`stroke-width: 5; stroke: ${iconColor}`"
          d="M90 10L90 100"
          class="m1-logo-element"
        >
          <animate
            :values="`${iconColor};rgba(0,0,0,0);rgba(0,0,0,0);${iconColor};`"
            attributeType="XML"
            attributeName="stroke"
            dur="1.5s"
            repeatCount="5"
          />
        </path>
      </g>
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
