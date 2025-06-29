AFRAME.registerComponent('move-object',{
    shcema:{
        attachDistance:{type: "number", default: 0.01},
        objectDistance:{type: "number", default: 0.01}
    },
    init: function(){
        this.PinchStart = this.PinchStart.bind(this);
        this.PinchMove = this.PinchMove.bind(this);
        this.PinchEnd = this.PinchEnd.bind(this);
        this.pinchedEl = null;
        // this.pincDetection = false;
        const items = document.querySelectorAll('.films');
        var rightHand = document.getElementById('rightHand');
        var leftHand = document.getElementById('leftHand');
        rightHand.addEventListener('pinchstarted', this.PinchStart)
        rightHand.addEventListener('pinchmoved', this.PinchMove)
        rightHand.addEventListener('pinchended', this.PinchEnd)
        leftHand.addEventListener('pinchstarted', this.PinchStart)
        leftHand.addEventListener('pinchmoved', this.PinchMove)
        leftHand.addEventListener('pinchended', this.PinchEnd)
    },

    PinchStart: function(evt){
        this.fingerPos = evt.detail.position;
        const worldPosition = new THREE.Vector3();
        items.forEach(item => {
            item.object3D.getWorldPosition(worldPosition);
            const distance = item.distanceTo(this.fingerPos);
            if (distance < objectDistance){
                this.pinchedEl = item;
                // item.data.pinchDetection = true;
            }
        });
    },

    // PinchStart: function(evt){
    //     const raycasterEl = document.querySelector('[raycaster]');
    //       // 現在カーソルが当たっている（交差している）オブジェクトのリストを取得
    //     const intersectedEls = raycasterEl.components.raycaster.intersectedEls;
    //     // 2. 当たった最初のオブジェクトを取得し、インスタンス変数に保存
    //     this.pinchedEl = intersectedEls[0];
    //     console.log(`Pinch started on: ${this.pinchedEl.id}`);
    // },

    PinchMove: function(evt){
        if (!this.pinchedEl) { return; }
          
            // イベントから新しいワールド座標を取得
            const newPosition = evt.detail.position;

            // 保存しておいたオブジェクトの座標を更新
            this.pinchedEl.setAttribute('position', newPosition);
    },

    PinchEnd: function(evt){
        if (!this.pinchedEl) { return; }
          
          console.log(`Pinch ended on: ${this.pinchedEl.id}`);
          this.pinchedEl = null;
    }
});

AFRAME.registerComponent('film-state',{
    schema:{
        pinchDetection:{type: 'boolean', default: false}
    }
})
