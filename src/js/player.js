let V3 = BABYLON.Vector3

class Player {

  constructor(scene, object, camera, options) {
    this.position = 0
    this.object = object
    this.jump_velocity = 0
    this.camera = camera
    this.camera_target = camera.alpha
  }
    
  left() {
    this.position--    
    this.camera_target += 0.6
  }
  right() {
    this.position++
    toGlobal(this.position)
    this.camera_target -= 0.6
  }
  jump() {
    if (this.jump_velocity !== 0)
      return
    this.jump_velocity = 0.4
    toGlobal(this.position)
  }


  animation () {
    this.object.position.x -= (this.object.position.x - toGlobal(this.position).x)/4
    this.camera.alpha -= (this.camera.alpha - this.camera_target)/16
    this.object.position.y += this.jump_velocity
    this.jump_velocity -=0.03

    if (this.object.position.y < 0.01) {
      this.object.position.y = 0
      this.jump_velocity = 0
    }

  }
}

const toGlobal = (x) => {
  return new V3(x*1.5, 0, 0)
} 





export {
  Player
}


