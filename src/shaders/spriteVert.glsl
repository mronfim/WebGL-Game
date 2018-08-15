precision mediump float;

attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec2 v_texCoord;

void main()
{
    gl_Position = mProj * mView * mWorld * vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}