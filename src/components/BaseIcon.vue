<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 82 80"
    style="vertical-align: middle;"
  >
    <title
      :id="iconName"
      lang="nl"
    >
      {{ iconName }} icon
    </title>
    <g :fill="iconColor">
      <g transform="translate(-4 -15)">
        <text
          id="m1-logo-m"
          font-family="Futura-Medium, Futura"
          font-size="72"
          class="m1-logo-element"
        >
          <tspan y="75">
            M
          </tspan>
        </text>
        <text
          id="m1-logo-1"
          font-family="Futura-Medium, Futura"
          font-size="72"
          class="m1-logo-element"
        >
          <tspan
            x="48.6"
            y="94"
          >
            1
          </tspan>
        </text>
        <path
          id="m1-logo-cursor"
          d="M84.5 16.5L84.5 93.5"
          class="m1-logo-element"
          :style="`stroke-width: 4; stroke: ${iconColor}`"
        >
          <animate
            attributeType="XML"
            attributeName="stroke"
            :values="`${iconColor};rgba(0,0,0,0);rgba(0,0,0,0);${iconColor};`"
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
