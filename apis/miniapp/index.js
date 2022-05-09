export const onKeyboardHeightChange_miniapp = (options) => {
  uni.onKeyboardHeightChange(res => {
    if (res.height) {
      options.arouse && options.arouse()
    } else {
      options.putAway && options.putAway()
    }
  })
}