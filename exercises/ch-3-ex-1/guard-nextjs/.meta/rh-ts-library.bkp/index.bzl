# Hey Emacs, this is -*- coding: utf-8; mode: bazel -*-

load("@npm_bazel_typescript//:index.bzl", _ts_library = "ts_library")

load(
  "@npm_bazel_typescript//:index.bzl",
  "rh_target",
  "rh_module",
)

def ts_library(tsconfig = None, **kwargs):
  if "rh_target_override" not in native.existing_rules():
    rh_target(
      name = "rh_target_override",
      build_setting_default = "es2018",
    )

  if "rh_module_override" not in native.existing_rules():
    rh_module(
      name = "rh_module_override",
      build_setting_default = "commonjs",
    )

  if not tsconfig:
    tsconfig = "@rh_ts_library//:tsconfig.json"

  _ts_library(
    runtime = "nodejs",
    rh_target_override = ":rh_target_override",
    rh_module_override = ":rh_module_override",
    tsconfig = tsconfig,
    **kwargs)
