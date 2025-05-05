# iOS Accessibility Elements Visualizer

This tool is used to visualize the accessibility element structure of iPhone applications, helping developers and designers better understand and optimize accessibility support in their apps.

## Features

- Read and parse iOS accessibility element JSON data
- Directly support two different formats of accessibility element data
- Visualize the position and hierarchy of accessibility elements on the screen
- Provide element filtering and detailed information viewing functionality

## Supported Formats

This tool supports two formats of accessibility element JSON data:

1. **Format 1**: Flat array structure, with each element listed in parallel
2. **Format 2**: Nested hierarchical structure, with a tree structure showing parent-child relationships

## Project Structure

```
idb_accessibility_elements_visualization/
├── json_format/               # Original JSON format examples
│   ├── format_1.json          # Format 1 example
│   └── format_2.json          # Format 2 example
├── visualizer.html            # Visualization interface
├── converter.js               # Format conversion tool
└── README.md                  # Project documentation
```

## Usage Instructions

### Visualization Interface

1. Open `visualizer.html` in a browser
2. Upload a JSON file using the file input
3. The system will automatically detect the format and display the format number
4. Use the filter options to show/hide different types of elements
5. Click on elements to view detailed information

## Format Description

### Format 1 (Flat Structure)

```json
[
    {
        "AXFrame": "{{0, 0}, {440, 956}}",
        "AXUniqueId": null,
        "frame": {
            "y": 0,
            "x": 0,
            "width": 440,
            "height": 956
        },
        "role_description": "application",
        "AXLabel": "Reminders",
        "type": "Application",
        "enabled": true,
        "role": "AXApplication"
    },
    {
        // Other elements...
    }
]
```

### Format 2 (Nested Structure)

```json
{
    "content": [
        {
            "type": "text",
            "text": [
                {
                    "AXFrame": "{{0, 0}, {440, 956}}",
                    "frame": {
                        "y": 0,
                        "x": 0,
                        "width": 440,
                        "height": 956
                    },
                    "role_description": "application",
                    "AXLabel": "Reminders",
                    "type": "Application",
                    "role": "AXApplication",
                    "children": [
                        // Child elements...
                    ]
                }
            ]
        }
    ]
}
```

## Development and Extension

### Adding Support for New Formats

1. Add new format detection logic in the `detectFormatType` function in `visualizer.html`
2. Create a corresponding `processFormat3` processing function
3. Add new format processing logic in the `processData` function

### Improving Visualization

You can improve the visualization by modifying the CSS and JavaScript code in `visualizer.html`, for example:

- Provide more visual distinctions based on element type and state
- Add zoom and pan functionality for viewing more complex hierarchies
- Implement search functionality for specific elements 