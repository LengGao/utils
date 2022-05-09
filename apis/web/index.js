export const onKeyboardHeightChange_h5 = (options) => {
  const originHeight = document.documentElement.clientHeight || document.body.clientHeight; 
  window.addEventListener('resize', () => {  
    const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (parseInt(resizeHeight) < parseInt(originHeight)) {
      options.arouse && options.arouse()
    } else {
      options.putAway && options.putAway()
    }
  })
}
