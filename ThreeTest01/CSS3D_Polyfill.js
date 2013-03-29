function CSS3D_Transform(s, fill) {
    s.transform = fill;
    s.WebkitTransform = fill;
    s.MozTransform = fill;
    return s;
}

function CSS3D_Perspective(s, fill) {
    s.WebkitPerspective = fill;
    s.MozPerspective = fill;
    return s;
}

function CSS3D_PerspectiveOrigin(s, fill) {
    s.WebkitPerspectiveOrigin = fill;
    s.MozPerspectiveOrigin = fill;
    return s;
}

function CSS3D_TransformStyle(s, fill) {
    s.WebkitTransformStyle = fill;
    s.MozTransformStyle = fill;
    return s;
}
