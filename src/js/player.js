let V3 = BABYLON.Vector3

class Player {

  constructor(scene, object, camera, options) {
    this.position = 0
    this.object = object
    this.jump_velocity = 0
    this.camera = camera
    this.y_zero = object.position.y
    this.camera_target = camera.alpha
  }
    
  left() {
    this.position--    
    this.camera_target += 0.6
  }
  right() {
    this.position++
    toGlobal(this.object, this.position)
    this.camera_target -= 0.6
  }
  jump() {
    if (this.jump_velocity !== 0)
      return
    this.jump_velocity = 0.4
    toGlobal(this.object, this.position)
  }


  animation (delta) {
    this.object.position.x -= (this.object.position.x - toGlobal(this.object, this.position).x)/4
    this.camera.alpha -= (this.camera.alpha - this.camera_target)/16
    this.object.position.y += this.jump_velocity
    this.jump_velocity -=0.03

    this.object.rotation.x += delta/100

    if (this.object.position.y < this.y_zero + 0.01) {
      this.object.position.y = this.y_zero
      this.jump_velocity = 0
    }

  }
}

const toGlobal = (object, x) => {
  return new V3(x*1.5, object.position.y, object.position.z)
} 





export {
  Player
}


