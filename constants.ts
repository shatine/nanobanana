
import type { PromptExample } from './types';

export const generationPrompts: PromptExample[] = [
  {
    title: '실사형 장면',
    template:
      'A photorealistic [shot type] of [subject], [action or expression], set in [environment]. The scene is illuminated by [lighting description], creating a [mood] atmosphere. Captured with a [camera/lens details], emphasizing [key textures and details].',
    prompt:
      '일본의 노년 도예가의 사실적인 클로즈업 인물 사진, 그의 손은 점토로 뒤덮여 있고, 그의 작업장에서 조각에 집중하고 있습니다. 따뜻하고 부드러운 창문 빛이 그의 얼굴의 주름과 도자기의 질감을 강조하며, 평화롭고 명상적인 분위기를 자아냅니다. 50mm 프라임 렌즈로 촬영되어 얕은 피사계 심도를 만들어냅니다.',
  },
  {
    title: '세련된 삽화 및 스티커',
    template:
      'A [style] sticker of a [subject], featuring [key characteristics] and a [color palette]. The design should have [line style] and [shading style]. The background must be transparent.',
    prompt:
      '귀여운 치비 스타일의 행복한 레서판다 스티커. 크고 반짝이는 눈과 푹신한 꼬리를 가지고 있으며, 파스텔 오렌지, 크림, 다크 브라운 색상 팔레트를 사용합니다. 굵고 깨끗한 선과 부드러운 셀 셰이딩이 특징이며, 배경은 투명해야 합니다.',
  },
  {
    title: '이미지의 정확한 텍스트',
    template:
      'Create a [image type] for [brand/concept] with the text "[text to render]" in a [font style]. The design should be [style description], with a [color scheme].',
    prompt:
      '\'The Daily Grind\'라는 커피숍의 현대적이고 미니멀한 로고를 만들어 줘. 텍스트는 세련된 산세리프 글꼴로 작성되어야 해. 디자인은 갈색 원 안에 단순한 커피잔 아이콘을 특징으로 하며, 흙색 톤의 색상 구성표(짙은 갈색, 베이지색, 흰색)를 사용해야 해.',
  },
  {
    title: '제품 모형 및 상업용 사진',
    template:
      'A high-resolution, studio-lit product photograph of a [product description] on a [background surface/description]. The lighting is a [lighting setup] to [lighting purpose]. The camera angle is a [angle type] to showcase [specific feature].',
    prompt:
      '미니멀한 세라믹 커피 머그의 고해상도 스튜디오 조명 제품 사진입니다. 무광택 흰색 배경에 놓여 있습니다. 3점 소프트박스 조명으로 부드럽고 균일한 조명을 만들어 그림자를 최소화합니다. 카메라는 머그의 손잡이와 질감을 보여주기 위해 약간 높은 각도로 설정되었습니다. 초점은 선명합니다.',
  },
  {
    title: '미니멀리스트 및 네거티브 스페이스',
    template:
      'A minimalist composition featuring a single [subject] positioned in the [bottom-right/top-left/etc.] of the frame. The background is a vast, empty [color] canvas, creating significant negative space. Soft, subtle lighting.',
    prompt:
      '프레임의 오른쪽 하단에 위치한 섬세한 단풍잎 하나가 특징인 미니멀한 구성. 배경은 광활하고 텅 빈 크림색 캔버스로, 상당한 네거티브 스페이스를 만듭니다. 부드럽고 미묘한 조명이 잎의 맥을 강조합니다.',
  },
  {
    title: '연속적인 아트 (만화 패널)',
    template:
      'A single comic book panel in a [art style] style. In the foreground, [character description and action]. In the background, [setting details]. The panel has a [dialogue/caption box] with the text "[Text]".',
    prompt:
      '어둡고 느와르적인 아트 스타일의 단일 만화 패널. 전경에는 트렌치코트를 입은 지친 탐정이 비 오는 도시 거리에서 담배를 피우고 있습니다. 배경에는 네온 불빛이 젖은 아스팔트에 반사됩니다. 상단에 있는 캡션 상자에는 "도시는 잠들지 않았지만, 나는 잠들고 싶었다."라는 텍스트가 있습니다.',
  },
];

export const editingPrompts: PromptExample[] = [
  {
    title: '요소 추가 및 삭제',
    template: 'Using the provided image of [subject], please [add/remove/modify] [element] to/from the scene. Ensure the change is [description of how the change should integrate].',
    prompt: '제공된 고양이 이미지를 사용하여 작고 털실로 뜬 마법사 모자를 추가해 줘. 모자는 고양이의 머리 위에 자연스럽게 놓여야 하며, 조명과 그림자가 원본 사진과 일치해야 해.',
  },
  {
    title: '인페인팅 (시맨틱 마스킹)',
    template: 'Using the provided image, change only the [specific element] to [new element/description]. Keep everything else in the image exactly the same.',
    prompt: '제공된 거실 이미지를 사용하여 파란색 소파만 빈티지한 갈색 가죽 체스터필드 소파로 변경해 줘. 방의 나머지 부분, 조명, 그림자는 모두 그대로 유지해 줘.',
  },
  {
    title: '스타일 전이',
    template: 'Transform the provided photograph of [subject] into the artistic style of [artist/art style]. Preserve the original composition but render it with [description of stylistic elements].',
    prompt: '제공된 야간 현대 도시 거리 사진을 반 고흐의 스타일로 변환해 줘. 원래 구성을 유지하되, 소용돌이치는 붓놀림과 생생한 색상 팔레트로 렌더링해 줘.',
  },
  {
    title: '고급 합성',
    template: 'Create a new image by combining the elements from the provided images. Take the [element from image 1] and place it with/on the [element from image 2].',
    prompt: '전문적인 전자상거래 패션 사진을 만들어 줘. 여성 모델 이미지와 드레스 이미지를 사용해서, 모델이 드레스를 입고 있는 것처럼 보이게 해줘. 최종 이미지는 흰색 배경에 사실적으로 보여야 해.',
  },
  {
    title: '충실도 높은 세부정보 보존',
    template: 'Using the provided images, place [element from image 2] onto [element from image 1]. Ensure that the features of [element from image 1] remain completely unchanged.',
    prompt: '갈색 머리, 파란 눈, 무표정한 여자의 첫 번째 이미지를 가져와 줘. 로고가 있는 두 번째 이미지를 사용해서, 그 로고를 여자의 셔츠에 추가해 줘. 여자의 얼굴 특징, 머리카락, 표정은 절대 변경하지 마.',
  },
];
