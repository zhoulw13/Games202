class DirectionalLight {

    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, translate);
		mat4.scale(modelMatrix, modelMatrix, scale);

		// View transform
		mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        //mat4.transpose(viewMatrix, viewMatrix);
		// Projection transform
		//mat4.copy(projectionMatrix, camera.projectionMatrix.elements);

        mat4.identity(projectionMatrix);
        mat4.perspective(projectionMatrix, 120.0 * 3.14 / 180.0, 1.0, 1e-2, 1000.0);

        // Model transform
        let focalPoint = vec3.fromValues(this.focalPoint[0], this.focalPoint[1], this.focalPoint[2]);
        let lightPos = vec3.fromValues(this.lightPos[0], this.lightPos[1], this.lightPos[2]);
        let lightUp = vec3.fromValues(this.lightUp[0], this.lightUp[1], this.lightUp[2]);

        let forward = vec3.create();
        let right = vec3.create();
        let up = vec3.create();
        
        /*
        vec3.subtract(forward, focalPoint, lightPos);
        vec3.cross(right, lightUp, forward);
        vec3.cross(up, forward, right);

        mat4.targetTo(lightMVP, lightPos, focalPoint, lightUp);
        mat4.transpose(lightMVP, lightMVP);
        */

        /*
        let forward = vec3.create();
        let right = vec3.create();
        let up = vec3.create();
        vec3.subtract(forward, focalPoint, lightPos);
        vec3.cross(right, lightUp, forward);
        vec3.cross(up, forward, right);
        lightMVP = mat4.fromValues(
            right[0], right[1], right[2], 0,
            up[0], up[1], up[2], 0,
            forward[0], forward[1], forward[2], 0,
            lightUp[0], lightUp[1], lightUp[2], 0,
        );
        */
        
        /*modelMatrix = mat4.fromValues(
            1, 0, 0, 0, 
            0, -0.707, 0.707, 0, 
            0, -0.707, -0.707, 0,
            0, 0, 0, 1
        );

        // View transform
        viewMatrix = mat4.fromValues(
            1, 0, 0, -this.lightPos[0], 
            0, 1, 0, -this.lightPos[1], 
            0, 0, 1, -this.lightPos[2],
            0, 0, 0, 1
        );
    
        // Projection transform
        projectionMatrix = mat4.fromValues(
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0,
            0, 0, 0, 1
        );*/

        console.log(translate);
        
        console.log(modelMatrix);
        console.log(viewMatrix);
        console.log(projectionMatrix);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);


        return lightMVP;
    }
}
