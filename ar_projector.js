AFRAME.registerComponent('hit-object', {
    schema:{
        isAttached:{type: 'boolean', default: false},
        folderPath:{type: 'string', default: ""},
    },
    init: function(){
        // this.data.setPoints = document.querySelector("#point");
        this.snapPointEl = this.el;
        this.projectorEl = this.el.querySelector("#projector");
        this.isAttached = false;

        this.OnCollision = this.OnCollision.bind(this);
        this.RemoveComponent = this.RemoveComponent.bind(this);
        // this.OffCollision = this.OffCollision.bind(this);
        this.el.addEventListener('obbcollisionstarted', this.OnCollision);
        this.el.addEventListener('child-detached', this.RemoveComponent);
        // this.el.addEventListener('obbcollisionended', this.OffCollision);
        // this.el.addEventListener('obbcollisionstarted', (evt) => { //接触 
        //     const setPos = new THREE.Vector3();
        //     const spherePos = new THREE.Vector3();
        //     const collidedEl = evt.detail.withEl;
        //     // this.el.object3D.getWorldPosition(setPos);
        //     if (!collidedEl || !collidedEl.classList.contains('films')) return;
        //     this.snapPointEl.object3D.add(collidedEl.object3D);
        //     // collidedEl.removeAttribute('grabbable');
        //     collidedEl.setAttribute('position', { x: 0, y: 0, z: 0 });
        //     // collidedEl.setAttribute('rotation', '0 0 0');
        //     collidedEl.setAttribute('scale', { x: 2, y: 2, z: 2 });
        //     this.data.isAttached = true;
        //     this.filmId = collidedEl.id;
        //     if (filmId == "film1") this.data.folderPath = "./film1/image";
        //     else if (filmId == "film2") this.data.folderPath = "./film2/image";
        //     else if (filmId == "film3") this.data.folderPath = "./film3/image";
        //     // collidedEl.setAttribute('material', { color: '#0000FF' });
        //     // this.projectorEl.object3D.attach(collidedEl.object3D);
        //     // const snapPosition = this.snapPointEl.getAttribute('position');
        //     // collidedEl.setAttribute('position', snapPosition);
        //     // else this.el.sceneEl.appendChild(grabbedObject);
        //     // setTimeout(() => {
        //     //     collidedEl.setAttribute('grabbable', '');
        //     // }, 200);
        //     // collidedEl.removeAttribute(obb-collider);
        //     // this.snapPointEl.removeAttribute(obb-collider);
        // });

        // this.el.addEventListener('obbcollisionended', (evt) => {
        //     const collidedEl = evt.detail.withEl;
        //     const sceneEl = document.querySelector('a-scene');
        //     sceneEl.appendChild(collidedEl);
        //     collidedEl.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
        //     this.isAttached = false;
        // });
    
    },

    OnCollision: function(evt){
        const collidedEl = evt.detail.withEl;
        // this.el.object3D.getWorldPosition(setPos);
        if (!collidedEl || !collidedEl.classList.contains('films')) return;
        // this.el.object3D.attach(collidedEl.object3D);
        collidedEl.removeAttribute('grabbable');
        this.el.appendChild(collidedEl);
        // collidedEl.removeAttribute('grabbable');
        collidedEl.setAttribute('position', { x: 0, y: 0, z: 0 });
        // collidedEl.setAttribute('rotation', '0 0 0');
        collidedEl.setAttribute('scale', { x: 4, y: 4, z: 4 });
        this.data.isAttached = true;
        this.filmId = collidedEl.id;
        if (this.filmId == "film1") this.data.folderPath = "./film1/image";
        else if (this.filmId == "film2") this.data.folderPath = "./film2/image";
        else if (this.filmId == "film3") this.data.folderPath = "./film3/image";

        setTimeout(() => {
            collidedEl.setAttribute('grabbable', '');
        }, 500); // 0.5秒後
    },

    OffCollision: function(evt){
        const collidedEl = evt.detail.withEl;
        if (!collidedEl || !collidedEl.classList.contains('films')) return;
        const sceneEl = document.querySelector('a-scene');
        sceneEl.object3D.attach(collidedEl.object3D);
        // sceneEl.appendChild(collidedEl);
        collidedEl.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
        collidedEl.setAttribute('position', { x: 0.5, y: 1.6, z: 0 });
        this.data.isAttached = false;
    },

    RemoveComponent: function(evt){
        // evt.target には、削除された子要素のObject3Dが格納されている
        const removedChildObject = evt.target;
        console.log('子要素が削除されました:', removedChildObject.el.id);
        const sceneEl = document.querySelector('a-scene');
        sceneEl.appendChild(removedChildObject);
        // フィルムがはがされたことを確認
        if (removedChildObject.el.classList.contains('films')) {
        console.log('アタッチされていたフィルムがはがされました。isAttachedをfalseに設定します。');
        collidedEl.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
        // isAttachedフラグを更新
        this.data.isAttached = false;
        // 必要であれば、他の状態もリセット
        this.data.folderPath = "";
        }
    },


    // tick :function (){
    //     if (this.data.isAttached) this.projectorEl.setAttribute('material', {color: 'white'});
    //     else this.projectorEl.setAttribute('material', {color: 'black'});
    // }
});

AFRAME.registerComponent('detach', {
    init: function(){
        this.stopButton = this.el;
        this.setPoint = document.querySelector("#point");
        this.setSphere = this.setPoint.querySelector('a-sphere');
        this.el.addEventListener('obbcollisionstarted', (evt) => {
            this.isAttached = this.setPoint.components['hit-object'].data.isAttached;
            const collidedEl = evt.detail.withEl;
            if (!collidedEl.classList.contains('hands')) return;
            if (this.isAttached){
                this.el.setAttribute('material', {color: 'white'});
                const sceneEl = document.querySelector('a-scene');
                sceneEl.appendChild(this.setSphere);
                this.setSphere.setAttribute('position', { x: 0.7, y: 1.6, z: 0 });
                this.setSphere.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
                this.setPoint.components['hit-object'].data.isAttached = false;
            }
        });

        this.el.addEventListener('obbcollisionended', (evt) => {
            this.el.setAttribute('material', {color: 'orange'});
        });
    }
});

AFRAME.registerComponent('slide',{
    init: function(){
        this.setPoint = document.querySelector("#point");
        const extention = ".JPG";
        const img = document.querySelector("#photo");
        let num = 1;
        this.el.addEventListener('obbcollisionstarted', (evt) => {
            num += 1;
            const collidedEl = evt.detail.withEl;
            if (!collidedEl.classList.contains('hands')) return;
            this.isAttached = this.setPoint.components['hit-object'].data.isAttached;
            this.filmPath = this.setPoint.components['hit-object'].data.folderPath;
            if (this.isAttached){
                this.el.setAttribute('material', {color: 'white'});
            }
        });

         this.el.addEventListener('obbcollisionended', (evt) => {
            this.el.setAttribute('material', {color: 'cyan'});
        });
    }
});
