precision mediump float;

uniform vec4 color;

void main()
{
    gl_FragColor = vec4(color.r/255.0, color.g/255.0, color.b/255.0, color.a);
}