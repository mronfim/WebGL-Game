precision mediump float;

varying vec3 fragColor;

void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}