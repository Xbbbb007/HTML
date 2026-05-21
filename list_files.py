"""
列出指定扩展名的文件（相对路径）并输出其内容为 JSON 或打印到控制台。
用法示例：
  python list_files.py -r . -e .html .css .js
  python list_files.py --output files.json
"""
import os
import argparse
import json
import sys

def gather(root, exts):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        for fname in filenames:
            _, ext = os.path.splitext(fname)
            if ext.lower() in exts:
                full = os.path.join(dirpath, fname)
                rel = os.path.relpath(full, root).replace('\\', '/')
                try:
                    with open(full, 'r', encoding='utf-8') as fh:
                        content = fh.read()
                except Exception as e:
                    content = f"<error reading file: {e}>"
                results.append({
                    'path': rel,
                    'content': content
                })
    return results


def main():
    p = argparse.ArgumentParser(description='列出文件相对路径并导出内容')
    p.add_argument('-r', '--root', default='.', help='要扫描的根目录（相对或绝对），默认当前目录')
    p.add_argument('-e', '--extensions', nargs='+', default=['.html', '.css', '.js'], help='要包含的文件扩展名，带点号，例如 .html .css .js')
    p.add_argument('-o', '--output', default='files.txt', help='输出文件名，默认为 files.txt')
    args = p.parse_args()

    exts = set(e if e.startswith('.') else '.' + e for e in args.extensions)
    data = gather(args.root, set(x.lower() for x in exts))

    if args.output:
        try:
            out_path = args.output
            if out_path.lower().endswith('.txt'):
                with open(out_path, 'w', encoding='utf-8') as out:
                    for item in data:
                        out.write(f"Path: {item['path']}\n")
                        out.write('-' * 60 + '\n')
                        out.write(item['content'])
                        out.write('\n' + '=' * 60 + '\n\n')
                print(f'Wrote {len(data)} files to {out_path}')
            else:
                with open(out_path, 'w', encoding='utf-8') as out:
                    json.dump(data, out, ensure_ascii=False, indent=2)
                print(f'Wrote {len(data)} files to {out_path}')
        except Exception as e:
            print('Failed to write output:', e, file=sys.stderr)
            sys.exit(2)
    else:
        print(json.dumps(data, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
