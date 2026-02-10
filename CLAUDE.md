# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application called "rtools" that serves as a **Hanson Marathon Method Pace Calculator**. It generates training plans based on marathon goals and provides pace calculations for different training intensities.

## Development Commands

- **Development server**: `npm run serve` - starts dev server with hot reload
- **Build for production**: `npm run build` - compiles and minifies for production
- **Lint code**: `npm run lint` - runs ESLint to check code quality
- **Install dependencies**: `npm install` - install all project dependencies

## Architecture Overview

### Core Application Structure

The application follows a standard Vue 3 composition API pattern:

- **Main entry point**: `src/main.js` - sets up Vue app with Element Plus UI library and custom plugins
- **Root component**: `src/App.vue` - displays the main calculator interface
- **Primary component**: `src/components/DataTable.vue` - handles all pace calculations, training plan generation, and PDF export functionality

### Key Features

1. **Pace Calculator**: Displays a table of different running paces (recovery, easy, tempo, etc.) based on marathon goal times
2. **Training Plan Generator**: Provides beginner and advanced training plans with weekly schedules
3. **PDF Export**: Generates downloadable PDF training plans using html2canvas and jsPDF
4. **Interactive Interface**: Click on pace rows to select and generate personalized training plans

### Data Structure

- **Pace data**: `src/assets/pace.json` - contains pace tables for different marathon times
- **Training plans**: `src/assets/basicPlan.json` and `src/assets/advancePlan.json` - contain structured training schedules
- **Plan structure**: Each plan has weekly schedules with 7 days, each containing exercise descriptions, distances, and pace types

### UI Framework

- **Element Plus**: Used for tables, forms, buttons, and loading indicators
- **Custom styling**: Uses SCSS for styling with Element Plus theme customization in `src/element-variables.scss`
- **Responsive design**: Tables and forms adapt to different screen sizes

### Key Technical Components

- **PDF Generation**: `src/plugins/htmlToPdf.js` - Vue plugin for PDF export (currently commented out, functionality moved to DataTable component)
- **Pace calculations**: Complex logic in DataTable.vue for calculating training durations based on selected pace and workout type
- **Training plan parsing**: Dynamic rendering of training schedules with pace-specific calculations

### Data Flow

1. User selects a marathon goal time from the pace table
2. Application filters to show only the selected pace row
3. User can choose between Beginner/Advanced training plans
4. Training plan displays with calculated paces, distances, and durations
5. PDF generation captures the entire training plan for download

## Important Notes

- The application uses Chinese locale for Element Plus components
- ESLint rule `no-unused-vars` is disabled in configuration
- PDF generation requires specific canvas sizing calculations for A4 format
- Training plan calculations involve complex pace type mappings (speed, easy, recover, lsd, strength, tempo)