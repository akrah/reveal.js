###############################################################################
# Makefile to generate RevealJS slides from Markdown.
#
# It can used to call Grunt with predefined parameters.
#
# MIT licensed.
#
# Copyright (C) 2018 Adrien Krähenbühl
###############################################################################

#******************************************************************************
# PAREMETERS TO set
#
# The path to the root folder of RevealJS
REVEALJS_ROOT=$(CURDIR)
#******************************************************************************

# Generate the CSS, JS and HTML files of the RevealJS slides
all:
	grunt --gruntfile="$(REVEALJS_ROOT)/Gruntfile.js" --root="$(REVEALJS_ROOT)" --root="$(CURDIR)" default

# Only generate the main HTML file of the RevealJS slides
pandoc:
	grunt --gruntfile="$(REVEALJS_ROOT)/Gruntfile.js" --root="$(REVEALJS_ROOT)" --root="$(CURDIR)" pandoc

# Generate the CSS, JS and HTML files of the RevealJS slides and serve it in
# a local server
serve:
	grunt --gruntfile="$(REVEALJS_ROOT)/Gruntfile.js" --root="$(REVEALJS_ROOT)" --root="$(CURDIR)" serve

# Package the RevealJS slides in a ZIP file
zip:
	grunt --gruntfile="$(REVEALJS_ROOT)/Gruntfile.js" --root="$(REVEALJS_ROOT)" --root="$(CURDIR)" package
