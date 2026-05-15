# Diagramas de la Memoria SciLens

Esta carpeta contiene los 4 diagramas que se incrustan en la memoria del TFG, ya renderizados como PNG y listos para insertar en Word.

## Archivos

| PNG | Fuente Mermaid | Va en sección |
|---|---|---|
| `figura3_despliegue.png` | `figura3_despliegue.mmd` | 2.1 Arquitectura del sistema (tras el ASCII) |
| `figura4_casos_uso.png` | `figura4_casos_uso.mmd` | 2.1.1 Casos de uso |
| `figura5_er_mongodb.png` | `figura5_er_mongodb.mmd` | 2.2 Modelo de datos (al inicio) |
| `figura6_secuencia_login.png` | `figura6_secuencia_login.mmd` | 2.5 Flujos clave — Autenticación con JWT |

## Cómo insertarlas en Word

1. Abre tu `Memoria_SciLens.docx`.
2. Sitúa el cursor en cada placeholder (las cajas azul claro que dicen "Insertar PNG exportado desde mermaid.live").
3. Borra el placeholder completo (la caja con el texto).
4. **Insertar → Imagen → Este dispositivo** y seleccionas el PNG correspondiente.
5. Ajustes recomendados:
   - **Ancho**: 14–16 cm
   - **Ajuste de texto**: "En línea con el texto"
   - **Alineación**: Centrada
6. Mantén el **pie de figura** que ya tienes debajo (los "Figura 3.", "Figura 4.", etc.).

## Cómo regenerar los PNG si modificas un diagrama

Si quieres cambiar algún diagrama, edita el `.mmd` correspondiente y ejecuta desde la raíz del proyecto:

```bash
npx mmdc -i diagramas/figuraN.mmd -o diagramas/figuraN.png -b white -w 1600
```

Parámetros:
- `-i` archivo de entrada (.mmd)
- `-o` archivo de salida (.png)
- `-b white` fondo blanco (evita transparencia que se ve gris en Word)
- `-w 1600` ancho en píxeles (1400 para diagramas anchos como casos de uso, 1600 para el resto)

`mermaid-cli` ya está instalado como devDependency en el `package.json` raíz del proyecto.

## Si prefieres regenerarlos online

Alternativa sin instalar nada: copia el contenido de cualquier `.mmd` y pégalo en https://mermaid.live → botón **Actions → PNG → Download**.
