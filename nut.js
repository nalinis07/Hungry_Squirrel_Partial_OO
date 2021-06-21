class Nut {
    constructor (x,y,grp){
        this.obj = createSprite (x,y,10,10);
        this.obj.addImage(nutImg);
        this.obj.scale=0.06;
        grp.add (this.obj);

    }
}

class GNut extends Nut {
    constructor (x,y,grp) {
        super (x,y,grp);
        this.obj.addImage(gnutImg);
        this.obj.scale = 0.023;
    }
}