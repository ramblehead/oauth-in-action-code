;; Hey Emacs, this is -*- coding: utf-8 -*-

(require 'hydra)

(defvar rh-oauth-in-action/ch-3-ex1-run-client-buffer-name
  "*oauth-in-action/ch-3-ex1-client*")

(defun rh--oauth-in-action-run (command &optional shell-buffer-name)
  (let ((project-root (rh-project-get-root))
        (project-path (rh-project-get-path)))
    (switch-to-buffer (shell shell-buffer-name))
    (comint-quit-subjob)
    (comint-send-string (current-buffer) (concat "cd " project-root "\r"))
    (comint-send-string (current-buffer) (concat command "\r"))))

(defun rh-oauth-in-action-restart-client ()
  (interactive)
  (rh--oauth-in-action-run
   "node client.js"
   rh-oauth-in-action/ch-3-ex1-run-client-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-hydra-define ()
  (defhydra rh-wtx-storybook-hydra (:color blue :columns 6)
    "oauth-in-action/ch-3-ex1 project commands"
    ("l" cb-wtx-storybook-run-local "run-local")))

(rh-oauth-in-action-hydra-define)

(defun rh-oauth-in-action-setup ()
  (let* ((project-root (rh-project-get-root))
         (project-path (rh-project-get-path))
         (meta-path (concat project-root ".meta/"))
         file-rpath)
    (when project-root
      (setq file-rpath (file-relative-name buffer-file-name project-root))
      (cond
       ((string-match-p "\\.css\\'" file-rpath)
        (rh-setup-css-skewer))

       ((or (string-match-p "^#!.*node" (save-excursion
                                          (goto-char (point-min))
                                          (thing-at-point 'line t)))
            (setq ext-js (string-match-p "\\.js\\'" file-rpath)))
        ;; tsserver requires non-.ts files to be manually added to the files
        ;; array in tsconfig.json, otherwise the file will be loaded as part
        ;; of an 'inferred project'. This won't be necessary anymore after
        ;; TypeScript allows defining custom file
        ;; extensions. https://github.com/Microsoft/TypeScript/issues/8328
        (unless ext-js (setq tide-require-manual-setup t))
        (setq rh-js2-additional-externs
              (append rh-js2-additional-externs '("require" "exports")))
        ;; (rh-setup-javascript-tern-tide)
        (rh-setup-javascript-tide))))))
