const Controller = () => {
  let dx, dy
  let DELTA_SWIP_X = 5
  let DELTA_SWIP_Y = 5

  let mouse_pressed = false
  let target = null
  let press_event = new Event('press')
  let swipe_event = new Event('swipe')

  const keyCodes = {
    w:    'KeyW',
    d:    'KeyD',
    s:    'KeyS',
    a:    'KeyA',
    right: 'ArrowRight',
    down:  'ArrowDown',
    left:  'ArrowLeft',
    up:    'ArrowUp'
  }

  const keysDirections = {
    right: [keyCodes.d, keyCodes.right],
    down:  [keyCodes.s, keyCodes.down],
    left:  [keyCodes.a, keyCodes.left],
    up:    [keyCodes.w, keyCodes.up],
  }

  let pressedKeys = []
  let pressedKey

  const startup = () => {
    let canvas = document.getElementById('render-canvas')
    
    canvas.addEventListener('touchstart', mousedown, false)
    canvas.addEventListener('touchend', mouseup, false)
    canvas.addEventListener('touchmove', mousemove, false)

    document.addEventListener("pointerdown", mousedown, false);
    document.addEventListener("pointerup", mouseup, false);
    document.addEventListener("pointermove", mousemove, false);

    document.addEventListener('keydown', keydown, false)
    document.addEventListener('keyup', keyup, false)
  }
  startup()


  function keydown (event) {
    let num = checkExist(event.code, pressedKeys)
    if (!checkExist(event.code, pressedKeys)) {
      pressedKeys.push(event.code)
    }
    if (pressedKey !== event.code) {
      pressedKey = event.code
      if (keysDirections.right.includes(event.code)) {
        press_event.direction = 'right'
        dispatchEvent(press_event)
      }
      if (keysDirections.down.includes(event.code)) {
        press_event.direction = 'down'
        dispatchEvent(press_event)
      }
      if (keysDirections.left.includes(event.code)) {
        press_event.direction = 'left'
        dispatchEvent(press_event)
      }
      if (keysDirections.up.includes(event.code)) {
        press_event.direction = 'up'
        dispatchEvent(press_event)
      }
    }
  }

  function keyup (event) {
    pressedKey = null
  }

  function mousedown (event) {
    target = event.target
    swipe_event.myTarget = target

    mouse_pressed = true
    if (event.changedTouches) {
      let touches = event.changedTouches
      swipe_event.x1 = touches[touches.length - 1].pageX
      swipe_event.y1 = touches[touches.length - 1].pageY
    } else {
      swipe_event.x1 = event.x
      swipe_event.y1 = event.y
    }
  }


  function mouseup (event) {
    // mouse_pressed = false

  }


  function mousemove (event) {
    event.preventDefault();
    if (mouse_pressed) {
      if (event.changedTouches) {
        let touches = event.changedTouches
        dx = swipe_event.x1 - touches[0].pageX
        dy = swipe_event.y1 - touches[0].pageY

      } else {
        dx = swipe_event.x1 - event.x
        dy = swipe_event.y1 - event.y
      }

      if (Math.abs(dx) > DELTA_SWIP_X) {

        if (dx > DELTA_SWIP_X) {
          swipe_event.direction = 'left'
        }

        if (dx < -DELTA_SWIP_X) {
          swipe_event.direction = 'right'
        }

        mouse_pressed = false
        dispatchEvent(swipe_event)
        return
      }

      if (Math.abs(dy) > DELTA_SWIP_Y) {
        if (dy > DELTA_SWIP_Y) {
          swipe_event.direction = 'up'
        }

        if (dy < -DELTA_SWIP_Y) {
          swipe_event.direction = 'down'
        }

        mouse_pressed = false
        dispatchEvent(swipe_event)
        return
      }
    }
    
  }


  function mouseout (event) {
    //mouse_pressed = false
  }



  const checkExist = (obj, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr) {
        return i
      }
    }
    return false
  }
}

export default Controller()