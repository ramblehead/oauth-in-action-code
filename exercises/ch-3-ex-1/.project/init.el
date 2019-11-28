;; Hey Emacs, this is -*- coding: utf-8 -*-

;; (defun do-something (process signal)
;;   (when (memq (process-status process) '(exit signal))
;;     (message "Do something!")
;;     (shell-command-sentinel process signal)))

;; (let* ((output-buffer (generate-new-buffer "*Async shell command*"))
;;        (proc (progn
;;                (async-shell-command "sleep 10; echo Finished" output-buffer)
;;                (get-buffer-process output-buffer))))
;;   (if (process-live-p proc)
;;       (set-process-sentinel proc #'do-something)
;;     (message "No process running.")))


;; https://emacs.stackexchange.com/questions/18901/understanding-uninterned-symbols-and-macro-expansion

;; (setq print-gensym t)

;; (setq print-circle t)

;; (let ((make-symbol "max"))
;;   (make-symbol "max"))

(require 'hydra)

(defvar rh-oauth-in-action/ch-3-ex1-run-client-buffer-name
  "*oauth-in-action/ch-3-ex1-client*")

(defvar rh-oauth-in-action/ch-3-ex1-run-protected-resource-buffer-name
  "*oauth-in-action/ch-3-ex1-protected-resource*")

(defvar rh-oauth-in-action/ch-3-ex1-run-authorization-server-buffer-name
  "*oauth-in-action/ch-3-ex1-authorization-server*")

(defun rh-oauth-in-action/ch-3-ex1-restart-client ()
  (interactive)
  (rh-project-restart-shell-command
   "run-client"
   rh-oauth-in-action/ch-3-ex1-run-client-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-restart-protected-resource ()
  (interactive)
  (rh-project-restart-shell-command
   "run-protected-resource"
   rh-oauth-in-action/ch-3-ex1-run-protected-resource-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-restart-authorization-server ()
  (interactive)
  (rh-project-restart-shell-command
   "run-authorization-server"
   rh-oauth-in-action/ch-3-ex1-run-authorization-server-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-restart-all ()
  (interactive)
  (rh-oauth-in-action/ch-3-ex1-restart-client)
  (rh-oauth-in-action/ch-3-ex1-restart-protected-resource)
  (rh-oauth-in-action/ch-3-ex1-restart-authorization-server)
  (rh-bs-show-bs-in-bottom-0-side-window "shells"))

(defun rh-oauth-in-action/ch-3-ex1-kill-client ()
  (interactive)
  (rh-project-kill-shell-process
   rh-oauth-in-action/ch-3-ex1-run-client-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-kill-protected-resource ()
  (interactive)
  (rh-project-kill-shell-process
   rh-oauth-in-action/ch-3-ex1-run-protected-resource-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-kill-authorization-server ()
  (interactive)
  (rh-project-kill-shell-process
   rh-oauth-in-action/ch-3-ex1-run-authorization-server-buffer-name))

(defun rh-oauth-in-action/ch-3-ex1-kill-all ()
  (interactive)
  (rh-oauth-in-action/ch-3-ex1-kill-client)
  (rh-oauth-in-action/ch-3-ex1-kill-protected-resource)
  (rh-oauth-in-action/ch-3-ex1-kill-authorization-server))

(defun rh-oauth-in-action/ch-3-ex1-hydra-define ()
  (defhydra rh-oauth-in-action/ch-3-ex1-hydra (:color blue :columns 4)
    "oauth-in-action/ch-3-ex1 project commands"
    ("a" rh-oauth-in-action/ch-3-ex1-restart-all
     "restart-all")
    ("c" rh-oauth-in-action/ch-3-ex1-restart-client
     "restart-client")
    ("r" rh-oauth-in-action/ch-3-ex1-restart-protected-resource
     "restart-protected-resource")
    ("z" rh-oauth-in-action/ch-3-ex1-restart-authorization-server
     "restart-authorization-server")
    ("A" rh-oauth-in-action/ch-3-ex1-kill-all
     "kill-all")
    ("C" rh-oauth-in-action/ch-3-ex1-kill-client
     "kill-client")
    ("R" rh-oauth-in-action/ch-3-ex1-kill-protected-resource
     "kill-protected-resource")
    ("Z" rh-oauth-in-action/ch-3-ex1-kill-authorization-server
     "kill-authorization-server")))

(rh-oauth-in-action/ch-3-ex1-hydra-define)

(define-minor-mode rh-oauth-in-action/ch-3-ex1-mode
  "rh-oauth-in-action/ch-3-ex1 project-specific minor mode."
  :lighter " rh-oauth-in-action/ch-3-ex1"
  :keymap (let ((map (make-sparse-keymap)))
            (define-key map (kbd "<f9>") #'rh-oauth-in-action/ch-3-ex1-hydra/body)
            map))

(add-to-list 'rm-blacklist " rh-oauth-in-action/ch-3-ex1")

(defun rh-oauth-in-action/ch-3-ex1-setup ()
  (let* ((project-root (rh-project-get-root))
         ;; (project-path (rh-project-get-path))
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
