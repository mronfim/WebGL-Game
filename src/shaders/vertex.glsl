precision mediump float;

attribute vec2 a_position;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    gl_Position = mProj * mView * mWorld * vec4(a_position, 0.0, 1.0);
}