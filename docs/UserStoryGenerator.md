# User Story Generator

A powerful AI-powered tool that generates detailed user stories from various input sources, including requirements, PDF documents, and Figma designs.

## Features

### 1. Multi-Input Support
- **Text Requirements**: Direct input of feature requirements
- **PDF Documents**: Upload and extract requirements from PDF files
- **Figma Designs**: Import Figma JSON to extract screen flows and UI components
- **Combined Inputs**: Mix and match any combination of inputs for comprehensive stories

### 2. Persona-Based Story Generation
- **End User Focus**: Stories emphasizing user experience and outcomes
- **Business Stakeholder Focus**: Stories highlighting ROI and business value
- **Developer Focus**: Stories with technical implementation details

### 3. Smart Story Analysis
- **Quality Scoring**: Automatic evaluation of story quality across multiple dimensions:
  - Clarity
  - Completeness
  - Testability
  - Business Value
- **Improvement Suggestions**: AI-powered recommendations for story enhancement
- **INVEST Principle Validation**: Ensures stories follow agile best practices

### 4. Screen Flow Integration
- **Automatic Flow Detection**: Extracts navigation paths from Figma designs
- **Screen Mapping**: Identifies and maps screen relationships
- **User Journey Integration**: Incorporates screen flows into acceptance criteria

### 5. Jira Integration
- **Direct Story Creation**: Push generated stories to Jira
- **Project Selection**: Choose target Jira project
- **Field Mapping**: Automatic mapping of story fields to Jira fields
- **Advanced Configuration**: Support for epics, labels, and custom fields

### 6. Developer Tools
- **Figma JSON Generation**: Create Figma-compatible JSON from requirements
- **UI Preview**: Generate visual previews of the UI design
- **Screen Flow Visualization**: View and edit screen navigation flows

## Usage Guide

### Basic Story Generation
1. Enter requirements in the text field
2. Select a persona (End User, Business Stakeholder, or Developer)
3. Click "Generate" to create the story
4. Review and customize the generated story
5. Push to Jira or export

### Enhanced Story Generation with PDF
1. Upload a PDF document containing requirements
2. The system will automatically extract and process the text
3. Add any additional requirements in the text field
4. Generate the story with combined inputs

### Story Generation with Figma Integration
1. Upload Figma JSON file
2. The system will extract:
   - Screen names
   - Navigation flows
   - UI components
3. Generate a story with detailed screen flows
4. Optionally generate UI previews

### Quality Analysis
1. After story generation, view the quality score
2. Review improvement suggestions
3. Edit the story based on recommendations
4. Regenerate for improved quality

## Output Format

Generated stories include:
```json
{
  "summary": "Brief one-line summary",
  "description": "Detailed description",
  "acceptanceCriteria": [
    "List of acceptance criteria"
  ],
  "priority": "Medium",
  "storyPoints": 3,
  "screenFlows": [
    {
      "from": "Screen name",
      "to": "Screen name",
      "action": "User action"
    }
  ]
}
```

## Best Practices

1. **Requirements Input**
   - Be specific and clear
   - Include user context
   - Mention constraints
   - Specify expected behavior

2. **PDF Documents**
   - Use well-structured documents
   - Include clear headings
   - Provide context in the text

3. **Figma Integration**
   - Use clear screen names
   - Maintain consistent naming
   - Include navigation flows
   - Document user interactions

4. **Story Quality**
   - Review quality scores
   - Implement suggestions
   - Ensure INVEST principles
   - Validate acceptance criteria

## Technical Requirements

- Node.js 14+
- React 17+
- Material-UI 5+
- OpenAI API key
- Jira API access (optional)

## API Endpoints

### Story Generation
- `POST /api/generate/story`
  - Input: requirements, persona, figmaJson, documentText
  - Output: Generated user story

### PDF Processing
- `POST /api/generate/extract-pdf`
  - Input: PDF file
  - Output: Extracted text

### Figma Integration
- `POST /api/generate/figma-json`
  - Input: requirements, documentText, userStory
  - Output: Figma-compatible JSON

### UI Preview
- `POST /api/generate/figma-preview`
  - Input: figmaJson, requirements, documentText
  - Output: UI preview image

## Error Handling

The system handles various error cases:
- Invalid file formats
- Missing requirements
- API failures
- Invalid JSON
- File size limits
- Network issues

## Security

- File upload validation
- API key protection
- Input sanitization
- Error message sanitization
- File cleanup after processing

## Performance

- Optimized file processing
- Efficient JSON parsing
- Cached API responses
- Background processing for large files
- Progress tracking for long operations

## Future Enhancements

1. **Planned Features**
   - Story template customization
   - Bulk story generation
   - Advanced analytics
   - Custom quality metrics
   - Team collaboration tools

2. **Integration Roadmap**
   - GitHub integration
   - Slack notifications
   - Confluence export
   - Custom API endpoints
   - Webhook support

## Support

For issues and feature requests:
1. Check the documentation
2. Review common issues
3. Submit a bug report
4. Contact support team

## Contributing

We welcome contributions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Follow coding standards
5. Update documentation 