# 🚀 AI Marketing Brief Generator - Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
```

**To get your OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env.local` file

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Navigate to the Brief Builder

Open your browser and go to: `http://localhost:3000/brief-builder`

## 🎯 How It Works

### **Step 1: Wizard Interface**
- **7 logical steps** that break down the brief creation process
- **Form-based inputs** for easy data entry
- **Progress tracking** with visual indicators
- **Smart validation** to ensure required fields are filled

### **Step 2: AI Generation**
- **Streaming responses** for real-time feedback
- **Structured outputs** using JSON Schema
- **Professional prompts** written by marketing experts
- **Error handling** with helpful error messages

### **Step 3: Review & Edit**
- **Section-by-section editing** of the generated brief
- **Toggle between view and edit modes**
- **Save functionality** (currently to localStorage)
- **Download options** (JSON and PDF formats)

## 🔧 Troubleshooting

### **500 Error on Generation**
1. **Check your API key** - Make sure it's valid and has credits
2. **Verify environment variables** - Ensure `.env.local` is in the right place
3. **Check console logs** - Look for detailed error messages
4. **Verify OpenAI account** - Ensure your account is active and has access

### **Common Issues**
- **"Missing API key"** → Check your `.env.local` file
- **"Invalid JSON"** → The AI response couldn't be parsed
- **"Streaming failed"** → Network or API connectivity issues

### **Debug Mode**
- Check browser console for detailed error logs
- Verify network requests in DevTools
- Test API endpoint directly with Postman/curl

## 📱 Features Overview

### **Wizard Steps**
1. **Project Overview** - Basic project information
2. **Objectives & KPIs** - SMART goals and metrics
3. **Target Audience** - Demographics and motivations
4. **Brand & Positioning** - Role and competitive landscape
5. **Core Message** - Key insights and propositions
6. **Execution Details** - Channels, tone, and creative direction
7. **Review & Generate** - Final check and AI generation

### **AI Outputs**
- **Executive Summary** - High-level overview
- **Big Idea** - Core creative concept
- **Creative Territories** - Multiple creative directions
- **Customer Journey Map** - Stage-by-stage messaging
- **Test Plan** - A/B testing hypotheses
- **KPI Dashboard** - Performance metrics

### **Export Options**
- **JSON Download** - Raw data for integration
- **PDF Download** - Formatted document for sharing
- **Local Storage** - Save drafts for later editing

## 🎨 Customization

### **Modifying Prompts**
Edit `lib/prompt.ts` to change:
- AI personality and expertise level
- Output style and tone
- Specific instructions for your industry

### **Adding New Fields**
1. Update `lib/brief-schema.ts`
2. Modify `lib/brief-types.ts`
3. Add form inputs in the wizard
4. Update the review component

### **Changing AI Model**
Modify `OPENAI_MODEL` in your `.env.local`:
- `gpt-4o` - Best quality, higher cost
- `gpt-4-turbo` - Good balance
- `gpt-3.5-turbo` - Faster, lower cost

## 🚀 Production Deployment

### **Environment Variables**
- Set `NODE_ENV=production`
- Use production OpenAI API keys
- Consider rate limiting and monitoring

### **Security Considerations**
- Validate all user inputs
- Implement user authentication
- Monitor API usage and costs
- Add request rate limiting

### **Performance Optimization**
- Enable Edge Runtime (already configured)
- Consider caching generated briefs
- Monitor API response times
- Implement error retry logic

## 📚 Learning Resources

### **Marketing Strategy**
- [SMART Goals Framework](https://www.atlassian.com/blog/productivity/how-to-write-smart-goals)
- [Customer Journey Mapping](https://www.smashingmagazine.com/2015/01/all-about-customer-journey-mapping/)
- [Brand Positioning](https://www.brandingstrategyinsider.com/brand-positioning/)

### **AI & Prompt Engineering**
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [JSON Schema Validation](https://json-schema.org/learn/getting-started-step-by-step)

## 🤝 Support

If you encounter issues:
1. Check this setup guide
2. Review browser console logs
3. Verify your OpenAI API key and account status
4. Check the project's GitHub issues

## 🎉 Ready to Go!

You now have a professional-grade AI Marketing Brief Generator! The system will help you create comprehensive, strategic marketing briefs that are:

- **Strategically rigorous** with human insights
- **Creatively catalytic** with clear big ideas
- **Execution-ready** with detailed action plans

Happy brief building! 🚀
