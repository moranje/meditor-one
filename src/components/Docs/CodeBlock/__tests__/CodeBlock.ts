import { shallowMount, createLocalVue } from '@vue/test-utils'
import CodeBlock from '../index.vue'

const localVue = createLocalVue()

describe('Component: CodeBlock', () => {
  let wrapper

  beforeEach(() => {
    // local state
    // const state = {}

    wrapper = shallowMount(CodeBlock, {
      localVue,
      // propsData: {},
      // mocks: { // $route }
    })
  })

  it('is setup properly, sanity test', () => {
    // const wrapper = shallowMount(CodeBlock).setValue();
    expect(shallowMount(CodeBlock)).toBeTruthy()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // it('should have emitted \'<event-name>\' event', () => {
  //   wrapper.vm.$emit('<event-name>') // delete this
  //
  //   expect(wrapper.emitted('<event-name>')).toBeTruthy();
  // });

  // it('Click on button calls the method \'callMe\'', () => {
  //   wrapper.setProps({ callMe: jest.fn() })
  //
  //   // Insert call that triggers function call
  //
  //   expect(wrapper.$vm.callMe).toHaveBeenCalled()
  // })
})
