import math
import os
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "models"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 96
    bpy.context.scene.render.fps = 24


def material(name, color, roughness=0.55):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0
    return mat


def shade(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    return obj


def sphere(name, loc, scale, mat, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=16, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return shade(obj)


def cube(name, loc, scale, mat):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("soft_edges", "BEVEL")
    bevel.width = 0.08
    bevel.segments = 4
    obj.modifiers.new("soften", "WEIGHTED_NORMAL")
    return obj


def cyl(name, loc, radius, depth, mat, vertices=24, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return shade(obj)


def cone(name, loc, radius1, radius2, depth, mat, vertices=24, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=loc,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return shade(obj)


def make_eye(x, y, z):
    black = material("eye_black", (0.02, 0.018, 0.015, 1))
    eye = sphere("eye", (x, y, z), (0.055, 0.025, 0.08), black, 16)
    return eye


def smile(name, y, z, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 12
    curve.bevel_depth = 0.012
    curve.bevel_resolution = 3
    spl = curve.splines.new("BEZIER")
    spl.bezier_points.add(2)
    pts = [(-0.12, y, z), (0, y - 0.025, z - 0.045), (0.12, y, z)]
    for point, co in zip(spl.bezier_points, pts):
        point.co = co
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def wave_arm(name, shoulder, color, side=1):
    skin = color
    pivot = bpy.data.objects.new(f"{name}_wave_pivot", None)
    pivot.empty_display_type = "SPHERE"
    pivot.empty_display_size = 0.08
    pivot.location = shoulder
    bpy.context.collection.objects.link(pivot)

    upper = cyl(
        f"{name}_upper_arm",
        (shoulder[0] + side * 0.12, shoulder[1], shoulder[2] - 0.22),
        0.055,
        0.45,
        skin,
        rotation=(0, side * math.radians(18), 0),
    )
    upper.parent = pivot
    lower = cyl(
        f"{name}_forearm",
        (shoulder[0] + side * 0.18, shoulder[1], shoulder[2] - 0.54),
        0.048,
        0.36,
        skin,
        rotation=(0, side * math.radians(36), 0),
    )
    lower.parent = pivot
    hand = sphere(f"{name}_hand", (shoulder[0] + side * 0.26, shoulder[1], shoulder[2] - 0.74), (0.07, 0.06, 0.07), skin, 16)
    hand.parent = pivot

    for frame, angle in [(1, -18), (18, 28), (36, -16), (54, 28), (72, -10), (96, -18)]:
        bpy.context.scene.frame_set(frame)
        pivot.rotation_euler = (0, 0, side * math.radians(angle))
        pivot.keyframe_insert(data_path="rotation_euler", frame=frame)
    return pivot


def idle_bounce(objects):
    for obj in objects:
        start = obj.location.copy()
        for frame, dz in [(1, 0), (24, 0.06), (48, 0), (72, 0.045), (96, 0)]:
            bpy.context.scene.frame_set(frame)
            obj.location = start + Vector((0, 0, dz))
            obj.keyframe_insert(data_path="location", frame=frame)


def add_lights():
    bpy.ops.object.light_add(type="AREA", location=(0, -4, 5))
    key = bpy.context.object
    key.name = "softbox_key"
    key.data.energy = 450
    key.data.size = 4
    bpy.ops.object.light_add(type="POINT", location=(-3, 2, 3))
    fill = bpy.context.object
    fill.name = "warm_fill"
    fill.data.energy = 70


def export_model(filename):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_DIR / filename),
        export_format="GLB",
        export_animations=True,
        export_frame_range=True,
        export_yup=True,
    )


def build_pikachu():
    yellow = material("warm_yellow", (1.0, 0.78, 0.06, 1))
    dark = material("ear_tip", (0.06, 0.045, 0.03, 1))
    red = material("cheek_red", (1, 0.12, 0.08, 1))
    brown = material("tail_base", (0.45, 0.24, 0.07, 1))
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.78), (0.42, 0.34, 0.55), yellow)
    head = sphere("head", (0, 0, 1.42), (0.42, 0.34, 0.36), yellow)
    cone("left_ear", (-0.24, 0, 1.86), 0.09, 0.025, 0.55, yellow, rotation=(0, math.radians(-22), 0))
    cone("right_ear", (0.24, 0, 1.86), 0.09, 0.025, 0.55, yellow, rotation=(0, math.radians(22), 0))
    cone("left_ear_tip", (-0.31, 0, 2.06), 0.055, 0.01, 0.22, dark, rotation=(0, math.radians(-22), 0))
    cone("right_ear_tip", (0.31, 0, 2.06), 0.055, 0.01, 0.22, dark, rotation=(0, math.radians(22), 0))
    make_eye(-0.14, -0.32, 1.5)
    make_eye(0.14, -0.32, 1.5)
    sphere("left_cheek", (-0.27, -0.31, 1.36), (0.085, 0.025, 0.075), red, 16)
    sphere("right_cheek", (0.27, -0.31, 1.36), (0.085, 0.025, 0.075), red, 16)
    smile("smile", -0.345, 1.34, black)
    wave_arm("right", (0.34, -0.03, 1.15), yellow, side=1)
    cyl("left_arm", (-0.43, -0.02, 1.0), 0.055, 0.38, yellow, rotation=(0, math.radians(-28), 0))
    sphere("left_foot", (-0.18, -0.04, 0.2), (0.16, 0.13, 0.075), yellow, 16)
    sphere("right_foot", (0.18, -0.04, 0.2), (0.16, 0.13, 0.075), yellow, 16)
    cube("lightning_tail_a", (0.52, 0.1, 0.85), (0.08, 0.035, 0.32), brown)
    cube("lightning_tail_b", (0.72, 0.1, 1.12), (0.09, 0.035, 0.34), yellow)
    idle_bounce([body, head])


def build_charmander():
    orange = material("soft_orange", (1.0, 0.38, 0.08, 1))
    cream = material("belly_cream", (1.0, 0.82, 0.55, 1))
    flame = material("flame", (1.0, 0.12, 0.02, 1))
    flame2 = material("flame_core", (1.0, 0.85, 0.05, 1))
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.72), (0.36, 0.3, 0.55), orange)
    sphere("belly", (0, -0.28, 0.66), (0.25, 0.035, 0.38), cream)
    head = sphere("head", (0, -0.02, 1.34), (0.42, 0.35, 0.36), orange)
    make_eye(-0.14, -0.34, 1.43)
    make_eye(0.14, -0.34, 1.43)
    smile("smile", -0.365, 1.3, black)
    wave_arm("right", (0.32, -0.02, 1.06), orange, side=1)
    cyl("left_arm", (-0.38, -0.02, 0.95), 0.05, 0.36, orange, rotation=(0, math.radians(-28), 0))
    sphere("left_foot", (-0.16, -0.04, 0.17), (0.13, 0.11, 0.07), orange, 16)
    sphere("right_foot", (0.16, -0.04, 0.17), (0.13, 0.11, 0.07), orange, 16)
    cyl("tail", (0.43, 0.16, 0.55), 0.065, 0.72, orange, rotation=(math.radians(60), math.radians(28), 0))
    cone("tail_flame", (0.74, 0.34, 0.85), 0.13, 0.015, 0.38, flame)
    cone("tail_flame_core", (0.74, 0.31, 0.86), 0.07, 0.01, 0.28, flame2)
    idle_bounce([body, head])


def build_squirtle():
    blue = material("water_blue", (0.19, 0.7, 0.9, 1))
    shell = material("shell_brown", (0.55, 0.32, 0.14, 1))
    cream = material("shell_cream", (1.0, 0.86, 0.58, 1))
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.7), (0.34, 0.3, 0.48), cream)
    sphere("back_shell", (0, 0.16, 0.72), (0.38, 0.12, 0.5), shell)
    head = sphere("head", (0, -0.02, 1.28), (0.38, 0.32, 0.34), blue)
    make_eye(-0.13, -0.31, 1.36)
    make_eye(0.13, -0.31, 1.36)
    smile("smile", -0.34, 1.22, black)
    wave_arm("right", (0.31, -0.03, 0.98), blue, side=1)
    cyl("left_arm", (-0.36, -0.02, 0.86), 0.05, 0.34, blue, rotation=(0, math.radians(-30), 0))
    sphere("left_foot", (-0.16, -0.04, 0.16), (0.13, 0.11, 0.07), blue, 16)
    sphere("right_foot", (0.16, -0.04, 0.16), (0.13, 0.11, 0.07), blue, 16)
    cyl("tail_curl", (-0.38, 0.17, 0.45), 0.055, 0.42, blue, rotation=(math.radians(82), 0, math.radians(30)))
    idle_bounce([body, head])


def build_bulbasaur():
    green = material("mint_green", (0.35, 0.84, 0.58, 1))
    dark = material("bulb_green", (0.16, 0.55, 0.24, 1))
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.6), (0.48, 0.34, 0.35), green)
    head = sphere("head", (0, -0.18, 1.03), (0.42, 0.33, 0.3), green)
    cone("left_ear", (-0.25, -0.16, 1.24), 0.12, 0.02, 0.3, green, rotation=(0, math.radians(-25), 0))
    cone("right_ear", (0.25, -0.16, 1.24), 0.12, 0.02, 0.3, green, rotation=(0, math.radians(25), 0))
    sphere("bulb", (0, 0.14, 1.02), (0.34, 0.3, 0.36), dark)
    cone("bulb_tip", (0, 0.13, 1.34), 0.18, 0.015, 0.28, dark)
    make_eye(-0.14, -0.47, 1.08)
    make_eye(0.14, -0.47, 1.08)
    smile("smile", -0.495, 0.98, black)
    wave_arm("right", (0.36, -0.18, 0.82), green, side=1)
    cyl("left_leg", (-0.26, -0.18, 0.28), 0.065, 0.28, green)
    cyl("right_leg", (0.26, -0.18, 0.28), 0.065, 0.28, green)
    idle_bounce([body, head, bpy.data.objects["bulb"]])


def build_blastoise():
    blue = material("deep_blue", (0.18, 0.48, 0.82, 1))
    shell = material("shell_brown", (0.42, 0.26, 0.14, 1))
    cream = material("shell_cream", (0.93, 0.78, 0.52, 1))
    metal = material("cannon_metal", (0.55, 0.62, 0.66, 1), 0.35)
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.78), (0.43, 0.34, 0.52), cream)
    sphere("back_shell", (0, 0.15, 0.86), (0.48, 0.16, 0.58), shell)
    head = sphere("head", (0, -0.05, 1.42), (0.38, 0.32, 0.32), blue)
    cyl("left_cannon", (-0.25, 0.22, 1.38), 0.06, 0.46, metal, rotation=(math.radians(68), 0, 0))
    cyl("right_cannon", (0.25, 0.22, 1.38), 0.06, 0.46, metal, rotation=(math.radians(68), 0, 0))
    make_eye(-0.13, -0.34, 1.48)
    make_eye(0.13, -0.34, 1.48)
    smile("smile", -0.37, 1.34, black)
    wave_arm("right", (0.35, -0.03, 1.1), blue, side=1)
    cyl("left_arm", (-0.42, -0.02, 0.95), 0.06, 0.38, blue, rotation=(0, math.radians(-30), 0))
    sphere("left_foot", (-0.2, -0.05, 0.2), (0.15, 0.12, 0.075), blue, 16)
    sphere("right_foot", (0.2, -0.05, 0.2), (0.15, 0.12, 0.075), blue, 16)
    idle_bounce([body, head])


def build_charizard():
    orange = material("char_orange", (0.95, 0.36, 0.08, 1))
    cream = material("belly_cream", (1.0, 0.78, 0.45, 1))
    wing = material("wing_teal", (0.08, 0.35, 0.45, 1))
    flame = material("flame", (1, 0.12, 0.02, 1))
    flame2 = material("flame_core", (1, 0.85, 0.05, 1))
    black = material("face_line", (0.03, 0.025, 0.02, 1))
    body = sphere("body", (0, 0, 0.82), (0.36, 0.29, 0.58), orange)
    sphere("belly", (0, -0.27, 0.78), (0.23, 0.035, 0.42), cream)
    head = sphere("head", (0, -0.03, 1.52), (0.38, 0.32, 0.32), orange)
    make_eye(-0.13, -0.33, 1.58)
    make_eye(0.13, -0.33, 1.58)
    smile("smile", -0.36, 1.43, black)
    cone("left_horn", (-0.12, -0.02, 1.82), 0.045, 0.005, 0.22, orange, rotation=(0, math.radians(-12), 0))
    cone("right_horn", (0.12, -0.02, 1.82), 0.045, 0.005, 0.22, orange, rotation=(0, math.radians(12), 0))
    cube("left_wing", (-0.44, 0.17, 1.12), (0.08, 0.035, 0.45), wing)
    cube("right_wing", (0.44, 0.17, 1.12), (0.08, 0.035, 0.45), wing)
    wave_arm("right", (0.32, -0.03, 1.22), orange, side=1)
    cyl("left_arm", (-0.38, -0.02, 1.05), 0.05, 0.36, orange, rotation=(0, math.radians(-28), 0))
    cyl("tail", (0.42, 0.14, 0.55), 0.06, 0.82, orange, rotation=(math.radians(58), math.radians(28), 0))
    cone("tail_flame", (0.76, 0.34, 0.9), 0.12, 0.012, 0.42, flame)
    cone("tail_flame_core", (0.76, 0.31, 0.91), 0.065, 0.008, 0.3, flame2)
    sphere("left_foot", (-0.18, -0.05, 0.2), (0.14, 0.11, 0.07), orange, 16)
    sphere("right_foot", (0.18, -0.05, 0.2), (0.14, 0.11, 0.07), orange, 16)
    idle_bounce([body, head])


BUILDERS = {
    "pikachu-greeting.glb": build_pikachu,
    "charmander-greeting.glb": build_charmander,
    "squirtle-greeting.glb": build_squirtle,
    "bulbasaur-greeting.glb": build_bulbasaur,
    "blastoise-greeting.glb": build_blastoise,
    "charizard-greeting.glb": build_charizard,
}


for filename, builder in BUILDERS.items():
    reset_scene()
    add_lights()
    builder()
    export_model(filename)
    print(f"Exported {filename}")

