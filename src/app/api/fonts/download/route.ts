import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
    try {
        const { fonts } = await req.json();

        if (!fonts || !Array.isArray(fonts) || fonts.length === 0) {
            return NextResponse.json({ error: 'No fonts provided' }, { status: 400 });
        }

        const zip = new JSZip();
        const folder = zip.folder("louenesabbas-typography-collection");

        // Fetch all requested fonts in parallel
        await Promise.all(fonts.map(async (font: string) => {
            const downloadUrl = `https://fonts.google.com/download?family=${font.replace(/ /g, '%20')}`;
            try {
                const response = await fetch(downloadUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${font}`);
                const arrayBuffer = await response.arrayBuffer();

                // Google returns a zip file for each font. 
                // We will save it as FontName.zip inside our main zip.
                if (folder) {
                    folder.file(`${font.replace(/ /g, '-')}.zip`, arrayBuffer);
                }
            } catch (error) {
                console.error(`Error downloading font ${font}:`, error);
                // We continue even if one fails
            }
        }));

        const content = await zip.generateAsync({ type: "blob" });

        // Convert Blob to ArrayBuffer for Response
        const finalBuffer = await content.arrayBuffer();

        return new NextResponse(finalBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="typography-collection.zip"`,
            },
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
