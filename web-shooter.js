class webShooterEffect{
    constructor(canvas,video){
        this.canvas=canvas;
        this.video=video;
        this.ctx=canvas.getContext("2d");
        this.particles=[];
        this.animate();
    }


    animate(){
        this.ctx.drawImage(this.video,0,0,this.canvas.width,this.canvas.height);

        const locs=getMarkedLocation(this.ctx);
        if(locs.length>0){
            for(let i=0; i<locs.length;i++){
                this.ctx.beginPath();
                this.ctx.fillStyle='white';
                this.ctx.rect(locs[i][0], locs[i][1], 1 , 1);
                this.ctx.fill();
            }

            const C=average(locs);

            this.ctx.fillStyle="green";
            this.ctx.arc(...C,5,0,Math.PI*2);
            this.ctx.fill();

            const A=getFarthestFrom(locs,C);

            this.ctx.beginPath();
            this.ctx.fillStyle="lightgreen";
            this.ctx.arc(...A,5,0,Math.PI*2);
            this.ctx.fill();

            this.shoot(A,C);
        }

        this.updateParticles();
        this.drawParticles();
        this.drawWeb();

        requestAnimationFrame(this.animate.bind(this));

    }

    drawParticles(){
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].draw(this.ctx);
        }
    }

    updateParticles(){
        for(let i=0;i<this.particles.length;i++){
            if(this.particles[i].loc[0]<0 ||
                this.particles[i].loc[1]<0 ||
                this.particles[i].loc[0]>this.ctx.canvas.width ||
                this.particles[i].loc[1]>this.ctx.canvas.height){
                    this.particles.splice(i,1);
                    i--;
                }else{
                    this.particles[i].update();
                }
            
        }
    }

    drawWeb(){
        for(let i=0;i<this.particles.length-1;i++){
            for(let j=i+1;j<this.particles.length;j++){
                this.ctx.beginPath();
                this.ctx.strokeStyle="white";
                this.ctx.moveTo(...this.particles[i].loc);
                this.ctx.lineTo(...this.particles[j].loc)
                this.ctx.stroke();

            }
        }
    }

    shoot(from,to){
        const rate=[
            (to[0]-from[0])/1,
            (to[1]-from[1])/1
        ];
        this.particles.push(new particle(from,rate));
    }
}


class particle{
    constructor(loc,rate){
        this.loc=loc;
        this.rate=rate;

    }
    update(){
        this.loc[0]+=this.rate[0];
        this.loc[1]+=this.rate[1];

    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.arc(...this.loc,3,0,Math.PI*2);
        ctx.fill();
    }
}