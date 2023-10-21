import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        button: 'src/stories/button/index.ts',
        card: 'src/stories/card/index.ts',
        checkbox: 'src/stories/checkbox/index.ts',
        combobox: 'src/stories/combobox/index.ts',
        dialog: 'src/stories/dialog/index.ts',
        drawer: 'src/stories/drawer/index.ts',
        field: 'src/stories/field/index.ts',
        icon: 'src/stories/icon/index.ts',
        input: 'src/stories/input/index.ts',
        pagination: 'src/stories/pagination/index.ts',
        select: 'src/stories/select/index.ts',
        table: 'src/stories/table/index.ts',
        tabs: 'src/stories/tabs/index.ts',
        text: 'src/stories/text/index.ts',
        textarea: 'src/stories/textarea/index.ts',
        theme: 'src/stories/theme/index.ts',
        tilt: 'src/stories/tilt/index.ts',
        utility: 'src/stories/utility/index.ts',
    },
    splitting: false,
    clean: true,
    external: ['react'],
    dts: true,
    outDir: 'dist',
    format: ['cjs', 'esm'],
    loader: {
        '.module.scss': 'file',
    },
});
