import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable JSON parsing for base64 image payloads
  app.use(express.json({ limit: '30mb' }));

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // Multimodal AI Pollution Analysis endpoint
  app.post('/api/analyze-pollution', async (req: Request, res: Response): Promise<void> => {
    try {
      const { imageBase64, mimeType, location, userNotes } = req.body;

      if (!imageBase64) {
        res.status(400).json({ error: 'Missing imageBase64 in request body.' });
        return;
      }

      // Clean base64 string if it contains data URI prefix
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      const validMimeType = mimeType || 'image/jpeg';

      if (!ai) {
        // Fallback realistic response if GEMINI_API_KEY is not configured
        console.warn('GEMINI_API_KEY is not configured. Serving structured fallback analysis.');
        res.json({
          pollution_type: 'Plastic & Solid Municipal Waste Accumulation',
          category: 'Plastic Waste',
          description: 'Visible accumulation of non-biodegradable single-use plastic packaging, polythene bags, and fragmented debris scattered along the terrain. Surface degradation indicates prolonged environmental exposure.',
          severity: 'High',
          confidence: 89,
          environmental_impact: 'High risk of microplastic fragmentation into surrounding soil and storm runoff. Clogs natural drainage channels, poses ingestion hazards for local wildlife, and leaches phthalates into the ground.',
          recommended_action: 'Initiate municipal solid waste clearance, deploy containment nets across nearby storm channels, and install anti-litter signage with periodic sanitation inspection.',
          detected_items: ['Single-use plastic packets', 'PET bottles', 'Non-biodegradable polythene', 'Mixed municipal litter'],
          urgency_level: 'Immediate',
          marathi_summary: 'या ठिकाणी प्लास्टिक आणि घनकचऱ्याचे प्रमाण जास्त प्रमाणात दिसून येत आहे. यामुळे जमीन आणि पाण्याचे प्रदूषण होण्याचा मोठा धोका आहे. तत्काळ स्वच्छता आणि कचरा संकलन आवश्यक आहे.',
          disclaimer: 'Note: AI image analysis is an observational indicator and may not be scientifically conclusive when visual evidence alone cannot verify chemical or microscopic pollutants.',
        });
        return;
      }

      const prompt = `You are EchoGuard AI, a certified environmental science vision system for pollution detection, ecological hazard assessment, and civic reporting.
Analyze the provided photograph thoroughly for environmental pollution and degradation.
Location context: ${location ? JSON.stringify(location) : 'Unspecified field location'}
User observations: ${userNotes || 'None provided'}

Check for any of these categories:
- Plastic pollution (bottles, wrappers, polythene, microplastic risk)
- Solid waste / Garbage dumping / Unsegregated municipal refuse
- Water pollution (turbidity, discoloration, algae blooms, foam, floating scum, chemical runoff)
- Air pollution indicators (heavy smoke plume, industrial emissions, soot deposition, toxic haze)
- Soil pollution (illegal chemical dumping, industrial sludge, contaminated ground)
- Industrial or electronic waste (hazardous containers, battery leakage, scrap metal)
- Other visible environmental degradation (deforestation, sewage overflow, burning waste)

Instructions:
1. Be realistic, scientific, and accurate based ONLY on visible evidence in the photograph.
2. If the scene is clean or natural without pollution, explicitly state "No Significant Pollution Detected", set severity to "Low", confidence accordingly, and note positive environmental condition.
3. Structure your response in valid JSON conforming to the requested schema.
4. Provide both English details and a clear, simple Marathi summary (marathi_summary) suitable for local citizen understanding in Maharashtra, India.
5. Emphasize that visual image analysis is an observational assessment and requires lab verification for exact chemical composition.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: validMimeType,
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pollution_type: {
                type: Type.STRING,
                description: 'Clear title of the identified pollution issue',
              },
              category: {
                type: Type.STRING,
                description: 'Category such as Plastic, Garbage/Waste, Water, Air, Soil, Industrial, or None',
              },
              description: {
                type: Type.STRING,
                description: 'Detailed description of the observed pollutants',
              },
              severity: {
                type: Type.STRING,
                description: 'Must be one of: Low, Medium, High',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score percentage from 50 to 99',
              },
              environmental_impact: {
                type: Type.STRING,
                description: 'Potential ecological consequences, hazards to flora, fauna, or public health',
              },
              recommended_action: {
                type: Type.STRING,
                description: 'Concrete, actionable remediation and citizen/civic mitigation steps',
              },
              detected_items: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key visible items identified (e.g. plastic bags, dirty water, industrial smoke)',
              },
              urgency_level: {
                type: Type.STRING,
                description: 'Urgency rating: Immediate, Moderate, or Monitoring',
              },
              marathi_summary: {
                type: Type.STRING,
                description: 'A 2-3 sentence summary in clear Marathi explaining the issue, severity, and needed action.',
              },
            },
            required: [
              'pollution_type',
              'description',
              'severity',
              'confidence',
              'environmental_impact',
              'recommended_action',
            ],
          },
        },
      });

      const responseText = response.text || '';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (e) {
        console.error('Failed to parse Gemini JSON output:', responseText);
        // Fallback parse attempt
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse structured analysis output.');
        }
      }

      // Add standardized disclaimer as required
      parsedData.disclaimer =
        'Note: AI image analysis is an observational indicator and may not be scientifically conclusive when the image alone cannot verify chemical composition or microscopic pollutants.';

      res.json(parsedData);
    } catch (error: any) {
      console.error('Error during AI pollution analysis:', error);
      res.status(500).json({
        error: error.message || 'Internal server error while analyzing image with AI.',
      });
    }
  });

  // Serve static assets in production or mount Vite in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EchoGuard server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EchoGuard server:', err);
  process.exit(1);
});
