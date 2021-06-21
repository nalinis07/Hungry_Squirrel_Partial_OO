class Maze {
    constructor (x,y,w,h, col, grp) {
        this.mazePiece = createSprite (x,y,w,h);
        this.mazePiece.shapeColor = col ;
        grp.add (this.mazePiece);
    }

    
}